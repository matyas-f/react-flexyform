import Link from 'next/link'
import { Check, Split, TrendingUpIcon } from 'lucide-react'
import { Typescript } from '../components/icons/typescript'
import { Steppers } from '../components/icons/steppers'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <section className="container flex flex-col items-center justify-center max-w-3xl px-4 py-16 mx-auto text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Build dynamic, scalable
          <br />
          forms in a systematic way
        </h2>
        <p className="mb-10 text-lg text-fd-foreground">
          A React form library that makes maintaining complex forms easier
          <br />
          and delivers a better user and developer experience.
        </p>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-fd-primary rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <Link
            href="/docs"
            className="relative inline-block px-6 py-3 font-medium transition-all rounded-md bg-fd-foreground text-fd-background hover:bg-opacity-90"
          >
            Visit documentation
          </Link>
        </div>
      </section>
      <section className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 p-8 border bg-fd-card rounded-xl md:col-span-6">
            <div className="flex items-center justify-center w-12 h-12 p-3 mb-6 rounded-lg text-fd-foreground bg-fd-secondary">
              <Steppers />
            </div>
            <h3 className="mb-4 text-xl font-semibold">
              Multi-step form support
            </h3>
            <p className="text-fd-foreground">
              Configure each step as you see fit, navigate between them with
              confidence provided by the robust validation logic. Skip steps
              conditionally and decide which step to start at based on the
              initial data.
            </p>
          </div>

          <div className="col-span-12 p-8 border bg-fd-card rounded-xl md:col-span-6">
            <div className="flex items-center justify-center w-12 h-12 p-3 mb-6 rounded-lg text-fd-foreground bg-fd-secondary">
              <Check />
            </div>
            <h3 className="mb-4 text-xl font-semibold">
              Optimized validation flows
            </h3>
            <p className="text-fd-foreground">
              Make use of the granular options to set up the optimal triggers
              for your validations to provide the best user experience. Field
              validations and step validations are separated for handling any
              scenario optimally.
            </p>
          </div>

          <div className="col-span-12 p-8 border bg-fd-card rounded-xl md:col-span-4">
            <div className="flex items-center justify-center w-12 h-12 p-3 mb-6 rounded-lg text-fd-foreground bg-fd-secondary">
              <Split size={20} />
            </div>
            <h3 className="mb-4 text-xl font-semibold">Dynamic logic</h3>
            <p className="text-fd-foreground">
              Configure dynamic fields, behaviours and triggers. Implement the
              most common form related patterns in a few lines using the
              provided utilities.
            </p>
          </div>

          <div className="col-span-12 p-8 border bg-fd-card rounded-xl md:col-span-4">
            <div className="flex items-center justify-center w-12 h-12 p-3 mb-6 rounded-lg text-fd-foreground bg-fd-secondary">
              <TrendingUpIcon size={20} />
            </div>
            <h3 className="mb-4 text-xl font-semibold">Scalable solution</h3>
            <p className="text-fd-foreground">
              Couple your form components' logic to the FlexyForm state so you
              don't have to worry about inconsistent forms across your
              application.
            </p>
          </div>

          <div className="col-span-12 p-8 border bg-fd-card rounded-xl md:col-span-4">
            <div className="flex items-center justify-center w-12 h-12 p-3 mb-6 rounded-lg text-fd-foreground bg-fd-secondary">
              <Typescript />
            </div>
            <h3 className="mb-4 text-xl font-semibold">Type safety</h3>
            <p className="text-fd-foreground">
              Enjoy full type safety when configuring the forms and when
              interracting with them in any part of your application.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
