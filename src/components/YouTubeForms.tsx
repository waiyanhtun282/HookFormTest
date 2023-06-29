import { get, useFieldArray, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { isValidElement, useEffect } from "react";

type FormsValues = {
  username: string;
  email: string;
  channel: string;
  social:{
    twitter:string;
    facebook:string;
  };
  phoneNumbers:string[];
  phNumbers:{
    number:string;
  }[];
  age:number;
  dob:Date;
};

const YouTubeForms = () => {
  let renderCount = 0;
  const form = useForm<FormsValues>({
    defaultValues:{
      username:"",
      email:"",
      channel:"",
      social:{
        twitter:"",
        facebook:"",
      },
      phoneNumbers:["",""]
    },
    phNumbers:[{number: ''}],
    age:0,
    dob:new Date(),
    mode:"all",
  });
  const { register, control, handleSubmit, formState ,watch ,getValues ,setValue ,reset ,trigger} = form;
  const { errors , dirtyFields , touchedFields,isDirty ,isSubmitting,isSubmitted,isSubmitSuccessful,submitCount} = formState;
  // console.log(dirtyFields,touchedFields ,isDirty)
  console.log({isSubmitting,isSubmitted,isSubmitSuccessful,submitCount})
  // console.log(register);
//  useEffect(() =>{
//  const subscription =watch((value) =>{
//   console.log(value);
//  });
//  return(() =>subscription.unsubscribe())
//  },[watch]);


  renderCount++;

  const onSubmit = (data: FormsValues) => {
    console.log("Form data", data);
  };
  const {fields,append , remove } = useFieldArray({
    name:'phNumbers',
    control
  });
  const handleGetValue  =() =>{
    console.log("Get Values", getValues(["username","email"]))
  };
  const  handleSetValue =() =>{
    setValue("username","",{
      shouldValidate:true,
      shouldDirty:true,
      shouldTouch:true,
    })
  }
  useEffect(() => {
    if(isSubmitSuccessful){
      reset();
    }
    },[isSubmitSuccessful,reset]);
  return (
    <div>
      <h1>YouTube Form{renderCount}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="formControl">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: {
                value: true,
                message: "UserName is required",
              },
            })}
          />
          <p className="error">{errors?.username?.message}</p>
        </div>
        <div className="formControl">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value: /^[A-Za-z]+$/i,
                message: "Invalid email Format",
              },
              validate:(fieldValue) =>{
             return(
              fieldValue !=="admin@gmail.com" || "Enter a different email address"
             );
              },
              notBlackListed:(fieldValue) =>{
                return(
                  !fieldValue.endsWith("badoman.com") || "This domain is not supported"
                )
              },
              emailAvaliable: async (fieldValue) => {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                const data = await response.json();
                return data.length == 0 || "Email Already Exits"
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="formControl">
          <label htmlFor="channel">Channel</label>
          <input type="text" id="channel" {...register("channel",{
            required:{
              value:true,
              message:"Invalid channel"
            }
          })} />
          <p className="error">{errors?.channel?.message}</p>
        </div>
        <div className="formControl">
          <label htmlFor="twitter">twitter</label>
          <input type="text" id="twitter" {...register("social.twitter",{
            disabled:watch("channel") === "",
            required:"Enter twitter profile",
          })} />
          <p className="error">{errors?.twitter?.message}</p>
        </div>
        <div className="formControl">
          <label htmlFor="facebook">facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
          <p className="error">{errors?.facebook?.message}</p>
        </div>
        <div className="formControl">
          <label htmlFor="phoneNumbers">phoneNumbers</label>
          <input type="text" id="phoneNumbers" {...register("phoneNumbers.0")} />
          <p className="error">{errors?.phoneNumbers?.message}</p>
        </div>
        <div className="formControl">
          <label htmlFor="phNumbers">List of Number</label>
          <div>
      {
            fields.map((field,index) =>{
              return(
                <div className="formControl" key={field.id}>
                  <input type="text"  {...register(`phNumbers.${index}.number` as const)}/>
                  {
                    index > 0 && (
                      <button type="button" onClick={() => remove(index)}>Remove</button>
                    )
                  }
                </div>
              )
            })
          }
          <button type="button" onClick={() => append({number:""})}>Add Number</button>
          </div>
        </div>
        <div className="formControl">
          <label htmlFor="age">age</label>
          <input type="number" id="age" {...register("age",{
           valueAsNumber:true,
            required:{
              value:true,
              message:"Age is required"
            }
          })} />
          <p className="error">{errors?.age?.message}</p>
        </div>
        <div className="formControl">
          <label htmlFor="date">DOB</label>
          <input type="date" id="date" {...register("date",{
           valueAsDate:true,
            required:{
              value:true,
              message:"Date is required"
            }
          })} />
          <p className="error">{errors?.date?.message}</p>
        </div>
        <button disabled={!isDirty || !isValidElement || isSubmitting}>Submit</button>
        <button onClick={() =>reset()}>Reset</button>

        <button onClick={handleGetValue}>Get Values</button>
        <button onClick={handleSetValue}>Set Values</button>
        <button onClick={() => trigger("channel")}>Validate</button>


      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YouTubeForms;
