import { ISubscriptions } from "@/types";
const environment = process.env.NEXT_ENVIRONMENT!;

const test: ISubscriptions[] = [
  {
    plan_id: "plan_R8nr4icSP0pAQ3",
    name: "Pro",
  },
  {
    plan_id: "plan_R8nrJtjHz9ajBS",
    name: "Max",
  },
];
const live: ISubscriptions[] = [
  {
    plan_id: "plan_R8rFpJWpbf4p57",
    name: "Pro",
  },
  {
    plan_id: "plan_RApduJkBMLcCV7",
    name: "Max",
  },
];

export const subscriptions = environment === "Production" ? live : test;
