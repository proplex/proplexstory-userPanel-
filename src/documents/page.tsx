import React from "react";
import { DocusealBuilder, DocusealForm } from "@docuseal/react";
import jwt from "jsonwebtoken";
import { ArrowRightIcon } from "lucide-react";

const DocumentPage = () => {
  const token = jwt.sign(
    {
      user_email: "satish@fandora.app", //sender_email
      integration_email: "sundeeep@altrova.xyz", //signer_email
      name: "Example PDF",
      template_id: 603974,
      // document_urls: ["https://www.irs.gov/pub/irs-pdf/fw9.pdf"]
    },
    process.env.NEXT_PUBLIC_DOCUSEAL_TOKEN || ""
  );

  return (
    <section className='flex flex-col'>
      <div className='w-full text-center'>
        <header className='p-5 border-b border-gray-200 flex flex-row justify-between'>
          <h1 className='text-2xl font-bold'>Docuseal Builder</h1>
          <button className='bg-purple-500 hover:bg-purple-600 active:scale-90 transition-all duration-200 ease-linear active:bg-purple-500 text-white px-4 py-2 rounded-md flex flex-row items-center gap-2'>
            Send
            <ArrowRightIcon className='text-white' size={24} />
          </button>
        </header>
        <DocusealBuilder withSendButton={false} token={token} />
      </div>
      <div className='w-full'>
        <h1 className='text-2xl font-bold'>Docuseal Form</h1>
        <DocusealForm
          src='https://docuseal.com/d/QUa9Mppk1NLScv'
          email={'sundeeep@altrova.xyz'}
          completedMessage={{
            title: 'Success',
            body: 'Form submission completed successfully!',
          }}
          onComplete={(data) => console.log(data)}
        />
      </div>
    </section>
  );
};

export default DocumentPage;
