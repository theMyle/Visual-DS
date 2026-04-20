'use client';

type SimulatorQuickHelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LAYOUT_SECTIONS = [
  {
    title: 'Upper Left: Challenge Instructions',
    description: 'Read the goal, rules, and what your code should produce.',
  },
  {
    title: 'Visualization',
    description: 'Shows how the data structure changes while your solution runs.',
  },
  {
    title: 'Code Editor',
    description: 'Write your Solution logic using the provided API.',
  },
  {
    title: 'Lower Right: Console and Result',
    description: 'Console shows logs, values, and runtime errors. Result shows each test case and whether it passed.',
  },
];

const BUTTON_SECTIONS = [
  {
    title: 'Reset Simulator',
    description: 'Resets the structure and clears output.',
  },
  {
    title: 'Reset Code',
    description: 'Restores the starter code template in the editor.',
  },
  {
    title: 'Submit',
    description: 'Runs your solution and checks the test cases.',
  },
];

export default function SimulatorQuickHelpModal({ isOpen, onClose }: SimulatorQuickHelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/45 p-2 md:p-6" onClick={onClose}>
      <div
        className="h-full w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Simulator help"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-sm md:text-base font-semibold tracking-wide">Data Structure Simulator Help</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs md:text-sm text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <div className="h-[calc(100%-56px)] overflow-y-auto px-4 py-4 md:px-6 md:py-6">
          <div className="space-y-5">
            <section>
              <h3 className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-gray-600">Layout</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                {LAYOUT_SECTIONS.map((section) => (
                  <article key={section.title} className="rounded border border-gray-200 p-3 md:p-4">
                    <h4 className="text-sm font-semibold text-gray-900">{section.title}</h4>
                    <p className="mt-1 text-xs md:text-sm leading-relaxed text-gray-700">{section.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-gray-600">Buttons</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                {BUTTON_SECTIONS.map((section) => (
                  <article key={section.title} className="rounded border border-gray-200 p-3 md:p-4">
                    <h4 className="text-sm font-semibold text-gray-900">{section.title}</h4>
                    <p className="mt-1 text-xs md:text-sm leading-relaxed text-gray-700">{section.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-gray-600">Console and Result</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                <article className="rounded border border-gray-200 p-3 md:p-4">
                  <h4 className="text-sm font-semibold text-gray-900">Console</h4>
                  <p className="mt-1 text-xs md:text-sm leading-relaxed text-gray-700">
                    Shows printed values and runtime errors, which helps you check intermediate steps.
                  </p>
                </article>

                <article className="rounded border border-gray-200 p-3 md:p-4">
                  <h4 className="text-sm font-semibold text-gray-900">Result</h4>
                  <p className="mt-1 text-xs md:text-sm leading-relaxed text-gray-700">
                    Shows each test case with expected and actual output, plus whether it passed. Expand a case for details.
                  </p>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
