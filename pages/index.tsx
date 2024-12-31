// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import React from "react";
// import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";

// type FormValues = {
//   cart: {
//     name: string;
//     amount: number;
//   }[];
// };

// const renderCount = 0;

// const getTotal = (payload: FormValues["cart"]) => {
//   let total = 0;
//   for (const item of payload) {
//     total = total + (Number.isNaN(item?.amount) ? 0 : item?.amount);
//   }
//   return total;
// };

// const TotalAmount = ({ control }: { control: Control<FormValues> }) => {
//   const cartValues = useWatch({
//     control,
//     name: "cart",
//   });
//   console.log(cartValues);

//   return <p>{getTotal(cartValues)}</p>;
// };

// const Home = () => {
//   const {
//     register,
//     formState: { errors },
//     control,
//     handleSubmit,
//     watch,
//   } = useForm<FormValues>({
//     defaultValues: {
//       cart: [{ name: "", amount: 0 }],
//     },

//   });
//   const { fields, append, prepend, update, remove } = useFieldArray({
//     name: "cart",
//     control,
//     rules: {
//       minLength: {
//         value: 1,
//         message: "Tire ayaqqa",
//       },
//     },
//   });

//   // console.log(watch("cart"));

//   console.log(errors);
//   return (
//     <div>
//       <Button>RenderCount: {renderCount}</Button>
//       <form
//         onSubmit={handleSubmit((data) => {
//           console.log(data);
//         })}
//       >
//         {fields?.map((field, index) => {
//           return (
//             <section key={field.id}>
//               <Label>Name</Label>
//               <Input
//                 {...register(`cart.${index}.name`, {
//                   required: "Please enter name",
//                 })}
//               />
//               <p>{errors.cart?.[index]?.name?.message}</p>
//               <Label>Amount</Label>
//               <Input
//                 type="number"
//                 {...register(`cart.${index}.amount`, { valueAsNumber: true })}
//               />
//               <Button type="button" onClick={() => remove(index)}>
//                 Delete
//               </Button>
//               <Button
//                 type="button"
//                 onClick={() => {
//                   update(index, { name: "update", amount: 19 });
//                 }}
//               >
//                 Update
//               </Button>
//             </section>
//           );
//         })}
//         <Button
//           type="button"
//           onClick={() => {
//             append({ name: "Bill", amount: 0 });
//           }}
//         >
//           Append
//         </Button>
//         <Button
//           type="button"
//           onClick={() => {
//             prepend({ name: "Prepend", amount: 0 });
//           }}
//         >
//           Prepend
//         </Button>
//         <Button type="submit">Submit</Button>

//         <TotalAmount control={control} />

//         {errors.cart && <p>{errors.cart.message}</p>}
//       </form>
//     </div>
//   );
// };

// export default Home;
// import MultiSelector from '@/components/ui-items/MultipleSelector'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@radix-ui/react-label'
// import { useRouter } from 'next/router'
// import React, { useEffect, useRef, useState } from 'react'
// import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'

// type FormValues = {
//   firstName: string
//   lastName: string
//   cart: {name: string, amount: number}[]
// }

// const Home = () => {
//   const methods = useForm<FormValues>({
//     defaultValues: {
//       firstName: "s",
//       lastName: "r",
//       cart: [{name: "salom", amount: 0}]
//     }
//   })
//   const { handleSubmit, watch, control } = methods
//   const { append } = useFieldArray({
//     name: "cart",
//     control,
//   })
//   const cart = watch("cart")
//   console.log(cart);

//   const onSubmit = (data: FormValues) => {
//     console.log(data);
//     append({name: data.firstName, amount: 0})

//   }
//   const { push } = useRouter()
//   useEffect(()=> {
//     push("/warehouse/gas")
//   },[push])
//   return (
//     <div>
//       <div className='hidden'>
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <ChildComponent/>
//           <Button type='submit'>Submit</Button>
//         </form>
//       </FormProvider>
//       <FastCounter/>
//       <MultiSelector/>
//     </div>
//     </div>
//   )
// }

// export default Home

// const ChildComponent = () => {
//   const { register, formState: { errors } } = useFormContext();

//   return (
//     <div className="max-w-md space-y-2">
//       <Label>Ism</Label>
//       <Input {...register("firstName", { required: "Ismni kirit" })} />
//       {errors.firstName && typeof errors.firstName.message === 'string' && (
//         <p>{errors.firstName.message}</p>
//       )}

//       <Label>Familiya</Label>
//       <Input {...register("lastName", { required: "Familiyani kirit" })} />
//       {errors.lastName && typeof errors.lastName.message === 'string' && (
//         <p>{errors.lastName.message}</p>
//       )}
//     </div>
//   );
// };

// const FastCounter = () => {
//   const [count, setCount] = useState(0);
//   const [isCounting, setIsCounting] = useState(false);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   // Start counting when the mouse is pressed
//   const handleMouseDown = () => {
//     if (!isCounting) {
//       setIsCounting(true);
//       intervalRef.current = setInterval(() => {
//         setCount((prevCount) => prevCount + 1);
//       }, 50); // Adjust the speed of counting here (50ms interval)
//     }
//   };

//   // Stop counting when the mouse is released
//   const handleMouseUp = () => {
//     setIsCounting(false);
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//   };

//   // Stop counting if the mouse leaves the button or area
//   const handleMouseLeave = () => {
//     setIsCounting(false);
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//   };

//   return (
//     <div>
//       <Button
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseLeave}
//         className=' active:scale-95'
//       >
//         Hold to Count Fast
//       </Button>
//       <p>Count: {count}</p>
//     </div>
//   );
// };
"use client";

import Cars from "@/components/statistics/cars";
import { ExpenseStats } from "@/components/statistics/expense-stats";
import IncomeOutcomeGraph from "@/components/statistics/linegraph";
import React, { useEffect, useState } from "react";

const FormWrapper: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  useEffect(() => {
    const today = new Date();
    // Calculate the start and end dates of the last month
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() , 1);
    const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    console.log(firstDayLastMonth);
    console.log(lastDayLastMonth);
    
    // Format the dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
      const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
      return `${year}-${month}-${day}`;
    };

    // Set the default start and end dates
    setStartDate(formatDate(firstDayLastMonth));
    setEndDate(formatDate(lastDayLastMonth));
  }, []);
  return (
    <div>
      <ExpenseStats end={endDate} setEnd={setEndDate} start={startDate} setStart={setStartDate} />
      <div className=" grid grid-cols-1 gap-4">
        <IncomeOutcomeGraph  end={endDate} start={startDate} />
        <Cars />
      </div>
    </div>
  );
};

export default FormWrapper;
