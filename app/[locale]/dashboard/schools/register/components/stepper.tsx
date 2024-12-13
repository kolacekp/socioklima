import { HiCheckCircle } from 'react-icons/hi2';

export default function Stepper({ step, stepItems }: { step: number; stepItems: string[] }) {
  return (
    <>
      <ol className="mx-auto my-5 flex max-w-2xl items-center text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
        {stepItems.map((item, index, stepItems) => (
          <li
            key={index}
            className={`flex items-center 
          ${step >= index && "text-blue-700 dark:text-blue-500 sm:after:content-['']"} 
          ${
            index < stepItems.length - 1 &&
            'after:border-1 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700' +
              ' sm:after:inline-block md:w-full xl:after:mx-10'
          }`}
          >
            <span
              className="flex items-center whitespace-nowrap after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 
            sm:after:hidden"
            >
              {step > index ? (
                <HiCheckCircle className="mr-2 h-8 w-8 text-blue-600" />
              ) : (
                <span className="mr-2">{index + 1}</span>
              )}

              {item}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
