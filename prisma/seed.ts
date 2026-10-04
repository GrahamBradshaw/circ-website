import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // Seed Communities
  const communities = [
    {
      name: "Web Development",
      slug: "web-development",
      description: "Build modern web applications and digital experiences. From frontend interfaces to full-stack systems, this community covers the full spectrum of web technologies.",
      focusTags: ["React", "Next.js", "Node.js", "TypeScript", "Figma", "TailwindCSS"],
      activities: []
    },
    {
      name: "Data Science and Modelling",
      slug: "data-science",
      description: "Uncover insights from data. This community focuses on statistical analysis, data visualisation, machine learning pipelines, and real-world data modelling challenges.",
      focusTags: ["Python", "R", "Pandas", "NumPy", "Matplotlib", "SQL"],
      activities: []
    },
    {
      name: "AI and Machine Learning",
      slug: "ai-ml",
      description: "Explore artificial intelligence and build intelligent systems. From neural networks to NLP and computer vision, this community pushes the boundaries of what machines can do.",
      focusTags: ["TensorFlow", "PyTorch", "Keras", "Scikit-learn", "OpenAI", "Hugging Face"],
      activities: []
    },
    {
      name: "Web3 and Blockchain",
      slug: "web3-blockchain",
      description: "Decentralise everything. This community dives into blockchain technology, smart contracts, DeFi, NFTs, and the infrastructure of a trustless internet.",
      focusTags: ["Solidity", "Ethereum", "Hardhat", "IPFS", "Web3.js", "MetaMask"],
      activities: []
    },
    {
      name: "Programming Community",
      slug: "programming",
      description: "Sharpen your core programming skills. This community covers algorithms, data structures, competitive programming, and the fundamentals that every great engineer must master.",
      focusTags: ["C++", "Java", "Python", "Rust", "Algorithms", "LeetCode"],
      activities: []
    },
    {
      name: "Internet of Things",
      slug: "iot",
      description: "Connect the physical world to the digital. From Arduino prototypes to industrial IoT systems, this community builds hardware-software solutions that interact with reality.",
      focusTags: ["Arduino", "Raspberry Pi", "MQTT", "C", "Sensors", "Edge Computing"],
      activities: []
    },
    {
      name: "Networking and Cybersecurity",
      slug: "networking-cybersecurity",
      description: "Defend, protect, and understand digital infrastructure. This community explores network architecture, ethical hacking, penetration testing, cryptography, and the principles of securing systems in an increasingly connected world.",
      focusTags: ["Network Security", "Ethical Hacking", "Cryptography", "Wireshark", "Kali Linux", "Firewalls"],
      activities: [],
    }
  ];

  for (const community of communities) {
    await prisma.community.upsert({
      where: { slug: community.slug },
      update: {},
      create: community,
    });
    console.log(`Seeded community: ${community.name}`);
  }

  // Seed default Settings
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      contactEmail: "circ@mnu.ac.ke",
      aboutText: "Computing Innovation and Research Club at Mama Ngina University College.",
    },
  });
  console.log(`Seeded settings`);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
