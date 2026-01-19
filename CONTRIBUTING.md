# Contributing to NexusAI

**Licensed under MIT License by Ghost Protocol (Pvt) Ltd**

We welcome contributions! NexusAI is an open-source project and we appreciate any help, whether it's bug fixes, feature implementations, documentation improvements, or security research.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow
- Report security issues privately

## Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/yourusername/nexusai.git
cd nexusai
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Create .env.local with your Supabase credentials
cp .env.example .env.local
# Edit .env.local with your values

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bug fix branch
git checkout -b fix/bug-description
```

## Making Changes

### Code Style

We follow Next.js and React best practices:

```typescript
// ✅ Good - Clear, typed, functional
export async function getUserDocuments(userId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

// ❌ Bad - Unclear, no types, imperative
function getDocs(id) {
  return supabase.from('documents').select().eq('user_id', id)
}
```

### TypeScript

Always use TypeScript. Use strict types:

```typescript
// ✅ Good
interface Document {
  id: string
  title: string
  content: string
  created_at: Date
}

// ❌ Bad
const doc: any = {...}
```

### Components

Follow React 19 patterns:

```typescript
// ✅ Good - Server component by default
export async function DocumentList() {
  const documents = await getDocuments()
  return (...)
}

// Client-side with use client directive
'use client'
export function DocumentForm() {
  const [title, setTitle] = useState('')
  return (...)
}

// ❌ Bad - Unnecessary use of useEffect
useEffect(() => {
  fetch('/api/documents').then(...)
}, [])
```

### Forms & Validation

Use React Hook Form + Zod:

```typescript
// ✅ Good
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const form = useForm<FormData>({ resolver: zodResolver(schema) })
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  )
}
```

### Styling

Use Tailwind CSS utility classes:

```typescript
// ✅ Good
<div className="flex items-center justify-between gap-4 p-4">
  <h1 className="text-2xl font-bold">Title</h1>
</div>

// ❌ Bad - Inline styles or unnecessary classes
<div style={{ display: 'flex' }}>
  <h1 className="custom-title">Title</h1>
</div>
```

### Database Operations

Always use parameterized queries and type safety:

```typescript
// ✅ Good - Type-safe, parameterized
const { data } = await supabase
  .from('documents')
  .select('*')
  .eq('user_id', userId)
  .eq('id', documentId)

// ❌ Bad - String interpolation
const result = supabase.query(`
  SELECT * FROM documents 
  WHERE user_id = '${userId}'
`)
```

### Error Handling

```typescript
// ✅ Good - Specific error handling
try {
  const result = await supabase.from('documents').insert(data)
  if (result.error) {
    console.error('Insert failed:', result.error)
    toast({ title: "Failed to create document", variant: "destructive" })
  }
} catch (error) {
  console.error('Unexpected error:', error)
  toast({ title: "Something went wrong", variant: "destructive" })
}

// ❌ Bad - Silent failures
const result = await supabase.from('documents').insert(data)
```

## Git Workflow

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: Add document search functionality"
git commit -m "fix: Correct RLS policy for task deletion"
git commit -m "docs: Update deployment guide with Stripe setup"

# Format: [type]: [description]
# Types: feat, fix, docs, style, refactor, test, chore
```

### Pull Request Process

1. **Before submitting PR**:
   ```bash
   # Ensure tests pass
   npm run lint
   npm run build
   
   # Keep your branch up to date
   git fetch origin
   git rebase origin/main
   ```

2. **Create PR with description**:
   - What problem does this solve?
   - How does it solve it?
   - Any breaking changes?
   - Screenshots for UI changes

3. **PR Title Format**:
   - `[FEATURE] Add dark mode support`
   - `[FIX] Resolve chat streaming timeout`
   - `[DOCS] Update README with new API endpoint`

4. **Review Process**:
   - At least one maintainer review required
   - Address feedback promptly
   - Approve and merge when ready

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Feature works as intended
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Database operations work correctly
- [ ] Error states display properly
- [ ] Loading states are visible
- [ ] No breaking changes to existing features

### Automated Testing (Future)

When we add testing:

```bash
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:coverage  # Coverage report
```

## Documentation

### Adding New Features

Update relevant docs:

1. **README.md** - Feature overview
2. **ARCHITECTURE.md** - Technical details
3. **Code comments** - Implementation details
4. **JSDoc** - Function documentation

```typescript
/**
 * Generates a summary of user documents using AI
 * @param userId - The user's unique identifier
 * @param maxLength - Maximum summary length (default: 500)
 * @returns Promise containing the AI-generated summary
 * @throws Error if user not found or AI request fails
 */
export async function generateDocumentSummary(
  userId: string,
  maxLength: number = 500
): Promise<string> {
  // implementation
}
```

## Issue Labels

- **bug** - Something isn't working
- **enhancement** - New feature or improvement
- **documentation** - Improvements or additions to docs
- **good first issue** - Good for newcomers
- **help wanted** - Need community assistance
- **security** - Security vulnerability
- **wontfix** - Won't be fixed

## Security Vulnerabilities

**DO NOT** open a public issue for security vulnerabilities.

Instead, email: security@ghostprotocol.com

Include:
- Vulnerability description
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## License & Attribution

By contributing, you agree that your contributions will be licensed under the MIT License by Ghost Protocol (Pvt) Ltd.

All contributions must:
- Use appropriately licensed code (MIT, Apache 2.0, ISC)
- Include proper attribution in ATTRIBUTIONS.md
- Not include proprietary or copyrighted material

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in commit messages

## Questions?

- Check documentation: README.md, DEPLOYMENT.md, SECURITY.md, ARCHITECTURE.md
- Open a discussion on GitHub
- Email: dev@ghostprotocol.com

---

**Thank you for contributing to NexusAI! ❤️**
