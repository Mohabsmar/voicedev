import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default user
  const user = await prisma.user.upsert({
    where: { id: 'default-user' },
    update: {},
    create: {
      id: 'default-user',
      email: 'default@voicedev.local',
      name: 'Default User',
    },
  })

  console.log('✅ Created default user:', user.email)

  // Create default agent
  const agent = await prisma.agent.upsert({
    where: { id: 'default-agent' },
    update: {},
    create: {
      id: 'default-agent',
      userId: 'default-user',
      name: 'VoiceDev Assistant',
      description: 'Default AI assistant powered by GPT-5.4',
      provider: 'openai',
      model: 'gpt-5.4',
      systemPrompt: 'You are a helpful AI assistant.',
    },
  })

  console.log('✅ Created default agent:', agent.name)
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
