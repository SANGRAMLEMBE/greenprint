'use client';

import { useEffect, useState } from 'react';
import { useFootprintStore } from '@/lib/store/footprint';
import { Nav } from '@/components/ui/Nav';
import { QuestionnaireShell } from '@/components/questionnaire/QuestionnaireShell';
import { ResultsHero } from '@/components/results/ResultsHero';
import { FootprintBreakdown } from '@/components/results/FootprintBreakdown';
import { CountryComparison } from '@/components/results/CountryComparison';
import { LiveGridSignal } from '@/components/results/LiveGridSignal';
import { ActionPlanHeader } from '@/components/actions/ActionPlanHeader';
import { ActionCard } from '@/components/actions/ActionCard';
import { ScenarioSimulator } from '@/components/actions/ScenarioSimulator';
import { ProgressChart } from '@/components/tracking/ProgressChart';
import { CommittedActionsSummary } from '@/components/tracking/CommittedActionsSummary';
import { Hero } from '@/components/landing/Hero';
import { getPersonalisedActions } from '@/lib/actions/data';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { step, input, committedActionIds } = useFootprintStore();

  useEffect(() => {
    useFootprintStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Nav />
        <main id="main" className="mx-auto max-w-3xl px-4 py-12 text-center">
          <div className="inline-block w-8 h-8 rounded-full border-2 border-leaf border-t-transparent animate-spin" aria-label="Loading" />
        </main>
      </>
    );
  }

  const actions = input ? getPersonalisedActions(input, committedActionIds) : [];

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-4 py-8">
        {step === 'questionnaire' && (
          <div>
            <Hero />
            <div className="rounded-3xl bg-white shadow-card ring-1 ring-gray-100 p-6 sm:p-8 animate-slide-up">
              <QuestionnaireShell />
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-6" aria-live="polite">
            <ResultsHero />
            <div className="animate-slide-up [animation-delay:100ms]">
              <FootprintBreakdown />
            </div>
            <div className="animate-slide-up [animation-delay:180ms]">
              <CountryComparison />
            </div>
            <div className="animate-slide-up [animation-delay:260ms]">
              <LiveGridSignal />
            </div>
          </div>
        )}

        {step === 'actions' && (
          <div className="animate-fade-in">
            <ActionPlanHeader />
            <div className="space-y-3" aria-label="Personalised action cards">
              {actions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  committed={committedActionIds.includes(action.id)}
                />
              ))}
              {actions.length === 0 && (
                <p className="text-center text-coal-light py-8">
                  You&apos;ve committed to all available actions. Impressive! 🎉
                </p>
              )}
            </div>
            <ScenarioSimulator />
          </div>
        )}

        {step === 'tracking' && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-coal mb-6">Your progress</h1>
            <ProgressChart />
            <CommittedActionsSummary />
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-gray-100 py-8 text-center text-xs text-coal-light">
        <p className="mx-auto max-w-2xl px-4 leading-relaxed">
          Emission factors: DEFRA/DESNZ 2023 · EPA eGRID 2023 · IEA 2022 · Poore &amp; Nemecek (2018) ·{' '}
          <a href="https://ourworldindata.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-leaf">
            Our World in Data
          </a>{' '}
          (CC BY). CO₂e uses IPCC AR6 GWP100. Your data stays in your browser — no account, nothing sent.
        </p>
      </footer>
    </>
  );
}
