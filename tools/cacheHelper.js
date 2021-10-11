const db = require('../models')
const { Tweet, User, Reply, Like, sequelize } = db
const DEFAULT_EXPIRATION = 300
// TODO:改為hash格式，而非list
async function postTweet(loginUser, description, redis, transaction) {
  try {
    // 確保緩存及資料庫都寫入成功，否則rollback
    const { id } = await Tweet.create({
      UserId: loginUser,
      description,
    }, { transaction })

    const tweet = await Tweet.findOne({
      raw: true, nest: true,
      where: { id },
      attributes: ['id', 'description', 'createdAt', 'updatedAt',
        [
          sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Likes.id'))), 'totalLike'
        ],
        [
          sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Replies.id'))), 'totalReply'
        ],
        [
          sequelize.literal(`EXISTS (SELECT 1 FROM Likes WHERE UserId = ${loginUser} AND TweetId = Tweet.id)`), 'isLiked'
        ]
      ],
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        { model: Reply, attributes: [] },
        { model: Like, attributes: [] }
      ],
      transaction
    })

    redis
      .multi()
      .lpush('tweets', JSON.stringify(tweet))
      .exec()
    return tweet.id
  } catch (err) {
    console.warn(err)
  }
}

/**
 * 以取得主頁全部推文為例，key='Tweets'，會先判斷是否有在緩存裡，如果沒有，則執行cb拿資料，
 * 並將資料用hash格式存入緩存中，再者使用Sorted Set格式存資料(時間戳記,推文ID)，以便未來
 * 取資料時可以排序。
 * @param {String} key 
 * @param redis 
 * @param {Function} cb 
 * @returns {Array}
 */

function getOrSetCache(key, redis, cb) {
  return new Promise(async (resolve, reject) => {
    // 查看是否有緩存
    await redis.zrange(key, 0, -1, 'REV', async (err, keys) => {
      try {
        if (err) return reject(err)
        // 如果有緩存
        if (keys.length) {
          const data = await getCache(redis, keys)
          return resolve(data)
        } else {
          // 如果沒有緩存
          const freshData = await cb()
          await saveInCache(redis, key, freshData)
          return resolve(freshData)
        }
      } catch (err) {
        console.warn(err)
      }
    })
  })
}

/**
 * 利用keys來查找緩存(hash)資料
 * @param  redis 
 * @param {Array} keys 
 * @returns {Array} 回傳緩存資料（經轉化格式後）
 */

async function getCache(redis, keys) {
  try {
    const data = []
    for (const key of keys) {
      await redis.hgetall(key, (err, entries) => {
        // 改寫屬性的值，轉回js格式
        for (let [filed, value] of Object.entries(entries)) {
          entries[filed] = JSON.parse(value)
        }
        data.push(entries)
      })
    }
    return data
  } catch (err) {
    console.warn(err)
  }
}

/**
 * 使用hash存放資料
 * 使用sorted set紀錄資料順序
 * 未來可根據順序(score)來撈出hash緩存
 * @param redis 
 * @param {String} key 
 * @param {Array} freshData 
 */

async function saveInCache(redis, key, freshData) {
  try {
    for (const data of freshData) {
      // 將每筆資料（物件）拆成key,value
      for (const [filed, value] of Object.entries(data)) {
        await saveInHash(redis, `${key}:${data.id}`, filed, JSON.stringify(value), DEFAULT_EXPIRATION)
      }
      // 紀錄順序
      await saveInSortedSet(redis, key, data.createdAt.getTime(), data.id)
      await redis.expire(key, DEFAULT_EXPIRATION)
    }
  } catch (err) {
    console.warn(err)
  }
}

/**
 * 如果是存推文，則key=tweets, score=時間戳記, value=推文id
 *
 * @param  redis
 * @param  {String} key
 * @param  {String} score
 * @param  {Number} value
 */

async function saveInSortedSet(redis, key, score, value) {
  try {
    // TODO:效能優化,pipeline?
    await redis.zadd(key, score, `${key}:${value}`)
  } catch (err) {
    console.warn(err)
  }
}

/**
* 資料主要會用這個function存入緩存(hash格式)
* 如果是存推文，則key=tweets:id, filed=屬性, value=屬性值
* @param  redis
* @param  {String} key
* @param  {Variable} filed
* @param  {String} value
* @param  {Number} expire
*/

async function saveInHash(redis, key, filed, value, expire) {
  try {
    await redis.hset(key, filed, value)
    await redis.expire(key, expire)
  } catch (err) {
    console.warn(err)
  }
}

module.exports = ({ getOrSetCache, postTweet })