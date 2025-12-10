"use client";
import dynamic from 'next/dynamic';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IProperty } from "@/constants/global";

const NothingFound = dynamic(() => import("@/components/common/NothingFound"), { ssr: false });


const Faq = ({ faqs }: { faqs: IProperty['faqs'] }) => {
  if (faqs.length === 0)
    return (
      <div>
        < NothingFound text="No FAQ&apos;s found" />
      </div>
    );
  return (
    <div className="space-y-6 bg-white rounded-xl p-6 ">
      <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq._id}
            value={faq._id}
            className="border rounded-xl px-4 bg-white py-1"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className=" text-, bg-white font-[600] text-black">
                {faq.question?.trim() || "No question provided"}
              </span>
            </AccordionTrigger>
            <AccordionContent className=" font-medium border-gray-200 bg-white">
              {faq.answer?.trim() || "No answer provided"}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;