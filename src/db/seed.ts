import { db } from './connection.ts'
import { users, habits, entries, tags, habitTags } from './schema.ts'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const seed = async () => {
  console.log('🌱 Starting database seed...')

  try {
    console.log('🧹 Clearing existing data...')
    await db.delete(entries)
    await db.delete(habitTags)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(users)

    console.log('👤 Creating demo users...')

    const [demoUser] = await db
      .insert(users)
      .values({
        email: 'demo@habittracker.com',
        password: 'demo123',
        firstname: 'Demo',
        lastname: 'User',
        username: 'demouser',
      })
      .returning()

    console.log('🏷️ Creating tags...')
    const [healthTag] = await db
      .insert(tags)
      .values({ name: 'Health', color: '#10B981' })
      .returning()

    const [productivityTag] = await db
      .insert(tags)
      .values({ name: 'Productivity', color: '#3B82F6' })
      .returning()

    console.log('💪 Creating demo habits...')
    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: 'Exercise',
        description: 'Daily workout routine',
        frequency: 'daily',
        targetCount: 1,
      })
      .returning()

    await db
      .insert(habitTags)
      .values([{ habitId: exerciseHabit.id, tagId: healthTag.id }])

    console.log('📝 Adding completion entries...')
    const today = new Date()
    today.setHours(12, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      await db.insert(entries).values({
        habitId: exerciseHabit.id,
        completionDate: date,
        note: i === 0 ? 'Great workout today!' : null,
      })
    }

    console.log('\n🔍 Testing relational queries...')
    const userWithHabits = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'demo@habittracker.com'),
      with: {
        habits: {
          with: {
            entries: true,
            habitTags: {
              with: { tag: true },
            },
          },
        },
      },
    })

    console.log('✅ Database seeded successfully!')
    console.log('\n📊 Seed Summary:')
    console.log(`- Demo user has ${userWithHabits?.habits.length || 0} habits`)
    console.log('\n🔑 Login Credentials:')
    console.log('📧 Email: demo@habittracker.com')
    console.log('🔒 Password: demo123')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

const currentFile = fileURLToPath(import.meta.url)
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : ''

if (currentFile === invokedFile) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default seed
