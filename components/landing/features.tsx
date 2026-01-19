import { 
  FileText, 
  MessageSquare, 
  CheckSquare, 
  Users, 
  Sparkles, 
  Lock 
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "AI-Powered Documents",
    description: "Create, edit, and collaborate on documents with AI assistance. Generate content, summarize, and translate instantly."
  },
  {
    icon: MessageSquare,
    title: "Smart AI Chat",
    description: "Chat with your documents and data. Ask questions, get insights, and automate workflows with natural language."
  },
  {
    icon: CheckSquare,
    title: "Intelligent Tasks",
    description: "AI automatically prioritizes and schedules your tasks. Never miss a deadline with smart notifications."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time collaboration with your team. Comments, mentions, and shared workspaces for seamless teamwork."
  },
  {
    icon: Sparkles,
    title: "AI Automation",
    description: "Automate repetitive tasks with AI workflows. Save hours every week with intelligent automation."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SOC 2 compliant with end-to-end encryption. Your data is always safe and secure."
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Everything you need to work smarter
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful features designed to boost your productivity and help your team achieve more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
