import {
  FileText,
  Shield,
  ClipboardList,
  Wrench,
  Phone,
  Unlock,
} from 'lucide-react'

const benefits = [
  {
    icon: FileText,
    title: 'Registration Included',
    description:
      'All vehicle registration costs are covered — no surprise fees when renewal comes around.',
    color: 'text-[#1E40AF]',
    bg: 'bg-[#1E40AF]/10',
  },
  {
    icon: Shield,
    title: 'Insurance Covered',
    description:
      'Comprehensive motor vehicle insurance is included in your weekly subscription price.',
    color: 'text-[#2563EB]',
    bg: 'bg-[#2563EB]/10',
  },
  {
    icon: ClipboardList,
    title: 'CTP Included',
    description:
      'Compulsory Third Party insurance is taken care of — fully compliant on Australian roads.',
    color: 'text-[#0EA5E9]',
    bg: 'bg-[#0EA5E9]/10',
  },
  {
    icon: Wrench,
    title: 'Regular Servicing',
    description:
      'Scheduled servicing and maintenance are handled by us. Drive without the stress.',
    color: 'text-[#1E40AF]',
    bg: 'bg-[#1E40AF]/10',
  },
  {
    icon: Phone,
    title: 'Roadside Assist 24/7',
    description:
      'Stuck on the side of the road? Our 24/7 roadside assistance has you covered, anywhere.',
    color: 'text-[#2563EB]',
    bg: 'bg-[#2563EB]/10',
  },
  {
    icon: Unlock,
    title: 'No Lock-In Contracts',
    description:
      'Flexible terms to suit your lifestyle. Stay for a week or a year — the choice is yours.',
    color: 'text-[#0EA5E9]',
    bg: 'bg-[#0EA5E9]/10',
  },
]

export function BenefitsGrid() {
  return (
    <section
      className="section-padding bg-white"
      aria-labelledby="benefits-heading"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">
            Why Choose Us
          </p>
          <h2 id="benefits-heading" className="text-[#1E293B] mb-4">
            Everything Included.{' '}
            <span className="text-[#2563EB]">Zero Surprises.</span>
          </h2>
          <p className="text-[#64748B] text-lg">
            One weekly price covers everything. No hidden costs, no paperwork
            headaches — just drive.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#1E40AF]/30 hover:shadow-lg transition-all duration-300 group card-hover"
              >
                <div className={`inline-flex p-3 rounded-xl ${benefit.bg} mb-4`}>
                  <Icon
                    className={`h-6 w-6 ${benefit.color}`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-[#1E293B] font-bold text-lg mb-2 group-hover:text-[#1E40AF] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
