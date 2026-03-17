'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Sparkles, BookOpen, Scale, Quote, FileText, PenTool,
  Bot, User, GraduationCap, Lightbulb, Clock, Menu, X, ChevronDown, Send
} from 'lucide-react'

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')

// ==========================================
// UI COMPONENTS (Replaces Shadcn UI)
// ==========================================

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    }
    const sizes = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

// Card
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

// Accordion
const Accordion = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("space-y-4", className)}>{children}</div>
}

const AccordionItem = ({ children, className, style }: { children: React.ReactNode, className?: string, value?: string, style?: React.CSSProperties }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={cn("border-b border-border/50 rounded-xl px-6 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-card/80", className)} data-state={isOpen ? "open" : "closed"} style={style}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
        }
        return child
      })}
    </div>
  )
}

const AccordionTrigger = ({ children, className, isOpen, setIsOpen }: any) => {
  return (
    <div className="flex">
      <button
        type="button"
        className={cn("flex flex-1 items-center justify-between py-5 text-left text-base md:text-lg font-medium transition-all outline-none hover:no-underline group", className)}
        onClick={() => setIsOpen(!isOpen)}
        data-state={isOpen ? "open" : "closed"}
      >
        {children}
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:text-accent", isOpen && "rotate-180 text-accent")} />
      </button>
    </div>
  )
}

const AccordionContent = ({ children, className, isOpen }: any) => {
  if (!isOpen) return null
  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className={cn("overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down", className)}
    >
      <div className={cn("pt-0 pb-5", className)}>{children}</div>
    </div>
  )
}

// Spotlight
const Spotlight = ({ className, fill }: { className?: string; fill?: string }) => {
  return (
    <svg
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.21"
        ></ellipse>
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
};

// ==========================================
// SECTIONS
// ==========================================

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Lexalyse AI', href: '#lexalyse' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'border-b border-border/50 bg-background/95 backdrop-blur-lg shadow-lg shadow-background/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-all duration-300">
              <Scale className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-xl font-bold text-foreground">Lexalyse</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              Sign in
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate('/app')}
              className="bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden text-foreground p-2 hover:bg-secondary rounded-lg transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu className={`h-6 w-6 absolute transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
              <X className={`h-6 w-6 absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
            </div>
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300 px-4 py-3 rounded-lg ${
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50 mt-2">
                <Button variant="ghost" size="sm" className="justify-start text-muted-foreground">
                  Sign in
                </Button>
                <Button size="sm" onClick={() => navigate('/app')} className="bg-foreground text-background hover:bg-foreground/90">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(60, 90, 180, 0.15)"
      />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/3 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex min-h-screen flex-col lg:flex-row items-center py-24 lg:py-0">
          <div className="flex-1 z-10 w-full text-center lg:text-left">
            <div className="opacity-0 animate-fade-in-down flex justify-center lg:justify-start" style={{ animationFillMode: 'forwards' }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                </span>
                AI-Powered Legal Intelligence
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground text-balance opacity-0 animate-fade-in-up mx-auto lg:mx-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              The Complete
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-accent to-foreground animate-gradient bg-[length:200%_auto]">
                Legal AI Platform
              </span>
            </h1>
            
            <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed text-pretty opacity-0 animate-fade-in-up mx-auto lg:mx-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              Transform your legal practice with AI-powered analysis of 750+ bareacts, 
              50 years of precedents, and intelligent drafting assistance. 
              Research smarter, draft faster, argue better.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 opacity-0 animate-fade-in-up w-full sm:w-auto justify-center lg:justify-start" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              <Button size="lg" onClick={() => navigate('/app')} className="w-full sm:w-auto gap-2 group shadow-lg hover:shadow-accent/20">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-border/50 transition-all duration-300 hover:scale-105">
                View Demo
              </Button>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">10,000+</span> law students trust Lexalyse
              </p>
            </div>
          </div>

          <div className="flex-1 hidden md:flex relative h-[350px] sm:h-[450px] lg:h-[600px] w-full mt-8 lg:mt-0 opacity-0 animate-fade-in-right pointer-events-auto" 
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            
            <iframe 
              src="https://my.spline.design/nexbotrobotcharacterconcept-AYcbtQGjjkZJdRBJbydBzd5o/"
              frameBorder="0" 
              width="100%" 
              height="100%"
              title="Spline 3D Scene"
              className="rounded-2xl"
            />
            
            {/* Watermark hider */}
            <div className="absolute bottom-0 right-0 w-full h-12 lg:h-20 bg-background z-10" />
            
          </div>
        </div>
      </div>
    </section>
  )
}

const featuresList = [
  {
    icon: BookOpen,
    title: 'Academic Section',
    description: 'Simplified analysis of 750+ bareacts with AI-powered explanations making complex legal statutes accessible and understandable.',
    stats: '750+ Bareacts',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: Scale,
    title: 'Precedent Repository',
    description: 'Comprehensive collection of all precedent case summaries spanning 50 years of judicial decisions, fully searchable and categorized.',
    stats: '50 Years Coverage',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: Quote,
    title: 'Legal Maxims',
    description: 'Access 250+ essential legal maxims with their meanings, origins, and practical applications in modern legal practice.',
    stats: '250+ Maxims',
    gradient: 'from-amber-500/20 to-orange-500/20'
  },
  {
    icon: FileText,
    title: 'Doctrines of Law',
    description: 'Complete database of all legal doctrines with detailed explanations, case references, and practical implementation guides.',
    stats: 'All Doctrines',
    gradient: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    icon: Sparkles,
    title: 'Argument Enhancer',
    description: 'AI-powered tool that improves and strengthens your legal arguments by suggesting better phrasing, citations, and logical structures.',
    stats: 'AI-Powered',
    gradient: 'from-rose-500/20 to-red-500/20'
  },
  {
    icon: PenTool,
    title: 'DraftDash',
    description: 'Comprehensive drafting assistant for all court documents including petitions, applications, plaints, and written statements.',
    stats: 'All Courts',
    gradient: 'from-indigo-500/20 to-violet-500/20'
  },
]

function FeatureCard({ feature, index }: { feature: typeof featuresList[0], index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="bg-card border-border/50 hover:border-accent/50 hover:bg-black/80 transition-all duration-500 group h-full relative overflow-hidden hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1">
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-secondary/50 text-foreground group-hover:bg-accent/20 group-hover:text-accent transition-all duration-500 group-hover:scale-110">
              <feature.icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full group-hover:bg-accent/20 group-hover:text-accent transition-all duration-500">
              {feature.stats}
            </span>
          </div>
          <CardTitle className="text-foreground text-xl group-hover:text-accent transition-colors duration-300">{feature.title}</CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed mt-2">
            {feature.description}
          </CardDescription>
        </CardHeader>
        
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent to-accent/50 group-hover:w-full transition-all duration-500" />
      </Card>
    </div>
  )
}

function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/3 rounded-full blur-2xl translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-sm font-semibold text-accent mb-3 tracking-wider uppercase">Features</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Everything You Need for
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Modern Legal Practice
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty text-lg">
            Our comprehensive suite of AI-powered tools transforms how legal professionals 
            research, analyze, and draft legal documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const sampleResponses = {
  query: "What are the essential elements of a valid contract?",
  response: `Under Indian Contract Act, 1872, a valid contract requires:

**1. Offer and Acceptance (Section 2(a), 2(b))**
- Clear and unambiguous offer by one party
- Unconditional acceptance by the other party

**2. Lawful Consideration (Section 2(d))**
- Something of value exchanged between parties
- Must be lawful and not opposed to public policy

**3. Capacity to Contract (Section 11)**
- Parties must be of age of majority
- Must be of sound mind
- Not disqualified by law

**4. Free Consent (Section 14)**
- Consent must not be obtained by coercion, undue influence, fraud, misrepresentation, or mistake

**5. Lawful Object (Section 23)**
- Purpose of contract must be legal and not against public policy`
}

const sampleQueries = [
  "What are the essential elements of a valid contract under Indian law?",
  "Explain the doctrine of frustration with relevant case laws",
  "What is the limitation period for filing a civil suit?",
  "Summarize the landmark case of Vishaka vs State of Rajasthan"
]

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, 8)

    return () => clearInterval(timer)
  }, [text])

  return (
    <span>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}

function LexalyseSection() {
  const [showResponse, setShowResponse] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setTimeout(() => setShowResponse(true), 1000)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="products" ref={sectionRef} className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Flagship Product
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Lexalyse AI
            </h2>
            <p className="text-xl text-muted-foreground mb-6 text-pretty">
              Your intelligent legal assistant that responds to all queries related to Indian law.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                'Instant answers to complex legal questions',
                'Case law references and citations',
                'Statutory interpretations with examples',
                'Procedural guidance for all courts',
              ].map((item, index) => (
                <li 
                  key={index} 
                  className={`flex items-start gap-3 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${(index + 2) * 150}ms` }}
                >
                  <div className="mt-1 p-1.5 rounded-full bg-accent/20 animate-pulse">
                    <Sparkles className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            
            <Button size="lg" className="gap-2 group shadow-lg">
              Try Lexalyse AI
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <Card className="bg-card border-border/50 overflow-hidden shadow-2xl shadow-accent/5 hover:shadow-accent/10 transition-shadow duration-500">
              <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-secondary/30">
                <div className="p-2 rounded-xl bg-accent/20 animate-pulse">
                  <Bot className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    Lexalyse AI
                    <span className="flex h-2 w-2">
                      <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Legal Intelligence Assistant</p>
                </div>
              </div>
              
              <div className="p-4 space-y-4 min-h-[400px] max-h-[400px] overflow-y-auto">
                <div className={`flex justify-end transition-all duration-500 ${showResponse ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="bg-accent/20 rounded-2xl rounded-tr-sm px-4 py-3 border border-accent/20">
                      <p className="text-sm text-foreground">{sampleResponses.query}</p>
                    </div>
                    <div className="p-1.5 rounded-full bg-secondary shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className={`flex justify-start transition-all duration-500 delay-500 ${showResponse ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-start gap-2 max-w-[90%]">
                    <div className="p-1.5 rounded-full bg-accent/20 shrink-0 animate-pulse">
                      <Bot className="h-4 w-4 text-accent" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50">
                      <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {showResponse && <TypewriterText text={sampleResponses.response} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-border/50 bg-secondary/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask any legal question..."
                    className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300"
                  />
                  <Button size="icon" className="bg-foreground text-background hover:bg-foreground/90 rounded-xl h-11 w-11 transition-all duration-300 hover:scale-105">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {sampleQueries.slice(0, 2).map((query, index) => (
                    <button
                      key={index}
                      className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full hover:bg-secondary hover:text-foreground transition-all duration-300 truncate max-w-[200px] hover:scale-105"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

const faqs = [
  {
    question: "How can Lexalyse help me with my law school research papers?",
    answer: "Lexalyse simplifies complex legal research by providing instant access to 750+ simplified bareacts, 50 years of precedent case summaries, and 250+ legal maxims. Instead of spending hours in the library, you can quickly find relevant case laws, understand complex statutes in plain language, and build stronger arguments for your papers. Our AI understands legal context and helps you connect dots between related cases and principles.",
    icon: BookOpen
  },
  {
    question: "I struggle with understanding bareacts. How does Lexalyse make them easier?",
    answer: "We've analyzed and simplified over 750 bareacts into easy-to-understand summaries while maintaining legal accuracy. Each bareact comes with plain English explanations, relevant case interpretations, connected maxims, and practical examples. Whether it's IPC, CrPC, CPC, or specific acts like RERA or IT Act - you'll grasp complex provisions in minutes, not hours.",
    icon: Lightbulb
  },
  {
    question: "Can Lexalyse help me prepare better arguments for moot courts and debates?",
    answer: "Absolutely! Our Argument Enhancer is specifically designed for this. Input your basic argument, and our AI analyzes it against thousands of precedents, suggests stronger legal grounds, identifies potential counter-arguments, and recommends relevant maxims to strengthen your case. Many students have won national moot court competitions using arguments refined through Lexalyse.",
    icon: Scale
  },
  {
    question: "How does DraftDash help with legal drafting assignments?",
    answer: "DraftDash is your personal drafting assistant. Whether you need to draft petitions, plaints, written statements, affidavits, legal notices, or any court document - DraftDash guides you through the proper format, suggests relevant sections and provisions to cite, and ensures your drafts meet professional standards. It's like having a senior advocate review your work 24/7.",
    icon: FileText
  },
  {
    question: "Is Lexalyse affordable for law students?",
    answer: "We understand students work with limited budgets. That's why we offer special student pricing that's up to 70% off regular rates. With just one subscription, you get access to resources that would otherwise cost lakhs in legal databases and textbooks. Plus, the time you save can be invested in internships, moots, or part-time work - making Lexalyse an investment that pays for itself.",
    icon: GraduationCap
  },
  {
    question: "How much time can I realistically save using Lexalyse?",
    answer: "Students report saving 15-20 hours per week on legal research alone. Tasks that took days - like finding relevant precedents for a 5,000-word paper - now take hours. Our AI chatbot Lexalyse instantly answers complex legal queries, eliminating the need to flip through multiple textbooks. That's more time for internships, extracurriculars, or simply maintaining a healthy work-life balance during law school.",
    icon: Clock
  }
]

function FAQSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="faq" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <GraduationCap className="h-4 w-4" />
            For Law Students
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Questions Every Law Student{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-foreground">
              Asks
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            From first-year students to final-year mooters, Lexalyse transforms how you study, 
            research, and practice law. Here's how we help you excel.
          </p>
        </div>

        <div className={`max-w-3xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Accordion>
            {faqs.map((faq, index) => {
              const Icon = faq.icon
              return (
                <AccordionItem
                  key={index}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AccordionTrigger>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center transition-colors group-hover:bg-accent/20 group-data-[state=open]:bg-accent/20">
                        <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent group-data-[state=open]:text-accent" />
                      </div>
                      <span>
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        <div className={`mt-16 text-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-secondary/80 via-card to-secondary/80 border border-border/50 mx-auto">
            <div className="text-center sm:text-left">
              <p className="text-foreground font-semibold">Still have questions?</p>
              <p className="text-sm text-muted-foreground">Get instant answers from Lexalyse AI</p>
            </div>
            <Button className="ml-0 sm:ml-4">
              Try Lexalyse AI
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="pricing" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-card to-secondary p-8 md:p-16 text-center border border-border/50 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,130,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,130,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>
          
          <div className="absolute top-8 left-8 animate-pulse-slow">
            <Sparkles className="h-6 w-6 text-accent/40" />
          </div>
          <div className="absolute bottom-8 right-8 animate-pulse-slow delay-300">
            <Sparkles className="h-8 w-8 text-accent/30" />
          </div>
          <div className="absolute top-1/2 right-16 animate-pulse-slow delay-500">
            <Sparkles className="h-4 w-4 text-accent/50" />
          </div>
          
          <div className="relative z-10">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Ready to Transform Your
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-accent to-foreground animate-gradient bg-[length:200%_auto]">
                Legal Practice?
              </span>
            </h2>
            <p className={`text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Join thousands of legal professionals who are already using Lexalyse 
              to research smarter, draft faster, and argue better.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Button size="lg" className="gap-2 group shadow-lg">
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-border/50">
                Schedule Demo
              </Button>
            </div>
            
            <p className={`mt-6 text-sm text-muted-foreground transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              No credit card required. 14-day free trial.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const footerLinks = {
  Product: [
    { label: 'Academic Section', href: '#' },
    { label: 'Precedent Repository', href: '#' },
    { label: 'Legal Maxims', href: '#' },
    { label: 'Doctrines', href: '#' },
    { label: 'Argument Enhancer', href: '#' },
    { label: 'DraftDash', href: '#' },
    { label: 'Lexalyse AI', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <footer id="contact" ref={footerRef} className="py-16 border-t border-border/50 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className={`col-span-2 md:col-span-1 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <a href="/" className="flex items-center gap-2 mb-4 group">
              <div className="p-1.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-all duration-300">
                <Scale className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold text-foreground">Lexalyse</span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-Powered Legal Intelligence for modern legal professionals.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <div 
              key={category}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${(categoryIndex + 1) * 100}ms` }}
            >
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ transitionDelay: `${linkIndex * 30}ms` }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lexalyse. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a 
                key={social}
                href="#" 
                className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:scale-110"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ==========================================
// MAIN PAGE EXPORT
// ==========================================
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent font-sans">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <LexalyseSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
