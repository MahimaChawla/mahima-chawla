"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Option = {
  id: string;
  label: string;
  isCorrect: boolean;
};

type Scenario = {
  id: number;
  title: string;
  description: string;
  code: string;
  options: Option[];
  explanation: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Validating user input in a service layer",
    description:
      "You have a REST controller that calls a service. The service validates input and interacts with a repository. Where should you throw and catch the exception if the input is invalid?",
    code: `// Controller
public UserResponse createUser(@RequestBody CreateUserRequest request) {
    // 1) call into service
    User user = userService.createUser(request);
    return UserResponse.from(user);
}

// Service
public User createUser(CreateUserRequest request) {
    // TODO: validate request
    // TODO: talk to repository
}

// Repository
public User save(User user) {
    // writes to DB
}`,
    options: [
      {
        id: "opt-1",
        label: "Throw in the controller, catch in the repository",
        isCorrect: false,
      },
      {
        id: "opt-2",
        label: "Throw in the service, catch in the controller",
        isCorrect: true,
      },
      {
        id: "opt-3",
        label: "Throw and catch inside the repository so it never escapes",
        isCorrect: false,
      },
    ],
    explanation:
      "Input validation is a business rule, so the service is the right place to detect and THROW (e.g., InvalidInputException). The controller is the boundary to the outside world, so it should CATCH that exception and turn it into an HTTP 400 response. The repository should not know about HTTP or user input concerns.",
  },
  {
    id: 2,
    title: "Database failure while saving an order",
    description:
      "Your service calls a repository to save an order. The DB occasionally fails (network blip). Where do you throw, and where do you catch?",
    code: `// Service
public void placeOrder(OrderRequest request) {
    Order order = buildOrder(request);
    orderRepository.save(order); // may fail
    // send confirmation email
}

// Repository
public void save(Order order) {
    // insert into DB
}`,
    options: [
      {
        id: "opt-1",
        label: "Repository throws a low-level exception; service catches it and decides what to do",
        isCorrect: true,
      },
      {
        id: "opt-2",
        label: "Service throws and repository catches, logging the error silently",
        isCorrect: false,
      },
      {
        id: "opt-3",
        label: "Repository catches everything and just returns null",
        isCorrect: false,
      },
    ],
    explanation:
      "The repository is the place where the failure happens, so it THROWS a DB/IO-level exception. The service is responsible for the business flow (place order, send email), so it CATCHES and decides whether to retry, mark the order as failed, or propagate upwards. Silently swallowing in the repository or returning null hides real failures.",
  },
  {
    id: 3,
    title: "Unexpected bug in a handler",
    description:
      "You have a top-level request handler (HTTP or Kafka consumer). A random NullPointerException occurs deep in the call stack. Where is the best place to catch it?",
    code: `public void handleMessage(Event event) {
    // 1) parse event
    // 2) call service
    // 3) log result
    // Somewhere deep inside, a NullPointerException might be thrown
}`,
    options: [
      {
        id: "opt-1",
        label: "Catch every exception in every method and log it",
        isCorrect: false,
      },
      {
        id: "opt-2",
        label: "Let it bubble up to a top-level handler that catches, logs with context, and decides whether to nack/retry",
        isCorrect: true,
      },
      {
        id: "opt-3",
        label: "Never catch it; just let the whole process crash",
        isCorrect: false,
      },
    ],
    explanation:
      "For unexpected bugs, you usually let them BUBBLE up to a top-level boundary (HTTP filter, controller advice, Kafka error handler, etc.) which CATCHES them once, logs with context, and decides how to respond (500, nack, DLQ, etc.). Catching everywhere makes code noisy and still doesn’t give a coherent response strategy.",
  },
];

type ScenarioState = {
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  showExplanation: boolean;
};

export default function ExceptionGamePage() {
  const [stateById, setStateById] = useState<Record<number, ScenarioState>>({});

  const handleOptionClick = (scenarioId: number, option: Option) => {
    setStateById((prev) => ({
      ...prev,
      [scenarioId]: {
        selectedOptionId: option.id,
        isCorrect: option.isCorrect,
        showExplanation: true,
      },
    }));
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-4xl px-4 py-10 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Exception Flow Game
        </h1>
        <p className="text-sm text-slate-400">
          For each scenario, choose <span className="font-semibold">where to throw</span> 
          and <span className="font-semibold">where to catch</span> the exception. 
          The goal is to push errors to the right layer and handle them at the right boundary.
        </p>
      </header>

      <div className="space-y-6">
        {SCENARIOS.map((scenario) => {
          const scenarioState = stateById[scenario.id];

          return (
            <Card key={scenario.id} className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-slate-50">
                  {scenario.id}. {scenario.title}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {scenario.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="overflow-x-auto rounded-md bg-slate-950/80 p-4 text-sm text-slate-200">
                  <code>{scenario.code}</code>
                </pre>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-200">
                    Where should you throw and where should you catch?
                  </p>
                  <div className="flex flex-col gap-2">
                    {scenario.options.map((option) => {
                      const isSelected =
                        scenarioState?.selectedOptionId === option.id;
                      const isCorrect = scenarioState?.isCorrect;

                      let variantClasses =
                        "border-slate-700 bg-slate-900/70 text-left text-sm";
                      if (isSelected && isCorrect === true) {
                        variantClasses =
                          "border-emerald-500/70 bg-emerald-500/10 text-emerald-100";
                      } else if (isSelected && isCorrect === false) {
                        variantClasses =
                          "border-red-500/70 bg-red-500/10 text-red-100";
                      }

                      return (
                        <Button
                          key={option.id}
                          variant="outline"
                          className={variantClasses}
                          onClick={() => handleOptionClick(scenario.id, option)}
                        >
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 border-t border-slate-800 pt-4">
                {scenarioState?.showExplanation && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Explanation
                    </p>
                    <p className="text-sm text-slate-200">
                      {scenario.explanation}
                    </p>
                  </>
                )}
                {!scenarioState?.showExplanation && (
                  <p className="text-xs text-slate-500">
                    Pick an option to see the explanation.
                  </p>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
