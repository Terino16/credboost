import { FormControl, FormField as FormFieldUI, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { UseFormReturn } from "react-hook-form"
import { QuestionType } from "@/types/forms"

interface FormFieldProps {
  question: {
    id: string
    text: string
    type: QuestionType
    required: boolean
    options?: string[]
  }
  form: UseFormReturn<any>
}

export function FormField({ question, form }: FormFieldProps) {
  return (
    <FormFieldUI
      control={form.control}
      name={question.id}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{question.text}{question.required && " *"}</FormLabel>
          {question.type === 'text' && (
            <FormControl>
              <Input {...field} />
            </FormControl>
          )}
          {question.type === 'textarea' && (
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          )}
          {question.type === 'rating' && (
            <FormControl>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => field.onChange(rating)}
                    className={cn(
                      "rounded-md p-1 hover:bg-accent transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      Number(field.value) >= rating 
                        ? "text-yellow-500" 
                        : "text-muted-foreground"
                    )}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8",
                        Number(field.value) >= rating && "fill-current"
                      )}
                    />
                  </button>
                ))}
              </div>
            </FormControl>
          )}
          {question.type === 'radio' && question.options && (
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                    <label htmlFor={`${question.id}-${option}`}>{option}</label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          )}
          {question.type === 'checkbox' && question.options && (
            <FormControl>
              <div className="flex flex-col space-y-1">
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${question.id}-${option}`}
                      checked={field.value?.includes(option)}
                      onCheckedChange={(checked) => {
                        const currentValue = field.value || []
                        if (checked) {
                          field.onChange([...currentValue, option])
                        } else {
                          field.onChange(currentValue.filter((value: string) => value !== option))
                        }
                      }}
                    />
                    <label htmlFor={`${question.id}-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </FormControl>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 