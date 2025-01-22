import React from 'react'

function Numbers() {
    return (
        <section className="py-20 relative">
            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <h2 className="geist-mono-latin-700 text-3xl sm:text-4xl md:text-5xl font-bold text-center text-neutral-200 mb-12" style={{ transform: "translateY(20px)" }}>WordWars by
                    <span className="underline underline-offset-8 ml-5 decoration-emerald-400">Numbers</span>
                </h2>
                <div className="flex justify-center pt-9 gap-8">
                    <div className="rounded-xl border text-card-foreground shadow bg-neutral-900/50 border-neutral-800 w-full max-w-xs">
                        <div className="p-5 text-center space-y-2">
                            <div className="geist-mono-latin-600 font-semibold tracking-tight text-emerald-400 text-4xl">
                                190+
                            </div>
                            <div className="text-neutral-400 geist-mono-latin-400 text-base">Typist Registered</div>
                        </div>
                    </div>
                    <div className="rounded-xl border text-card-foreground shadow bg-neutral-900/50 border-neutral-800 w-full max-w-xs">
                        <div className="p-5 text-center space-y-2">
                            <div className="geist-mono-latin-600 font-semibold tracking-tight text-emerald-400 text-4xl">
                                7296+
                            </div>
                            <div className="text-neutral-400 geist-mono-latin-400 text-base">Races Completed</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Numbers
