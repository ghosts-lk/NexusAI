// Note: Replace these with real testimonials once you have paying customers
// These are placeholder examples to demonstrate the UI layout
const testimonials = [
  {
    quote: "This productivity tool streamlines our workflow and saves hours every week.",
    name: "Your Customer",
    title: "Happy User",
    avatar: "YC"
  },
  {
    quote: "The AI assistant helps me draft documents and organize tasks effortlessly.",
    name: "Future User",
    title: "Early Adopter",
    avatar: "FU"
  },
  {
    quote: "Simple, intuitive, and powerful. Exactly what our team needed.",
    name: "Beta Tester",
    title: "Community Member",
    avatar: "BT"
  }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Loved by teams worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of teams already using NexusAI to work smarter.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <p className="text-lg mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Value Props - use real stats once you have them */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-primary">10x</p>
            <p className="text-muted-foreground">Faster Workflows</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">AI</p>
            <p className="text-muted-foreground">Powered Features</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">99.9%</p>
            <p className="text-muted-foreground">Target Uptime</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">Free</p>
            <p className="text-muted-foreground">To Start</p>
          </div>
        </div>
      </div>
    </section>
  )
}
