import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { MessageSquareTextIcon } from "lucide-react";
import Image from "next/image";
import usePostReview from "@/hooks/project/review/usePostReview";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

// Zod schema for form validation
const reviewSchema = z.object({
    review: z.string().min(10, { message: "Review must be at least 10 characters long" }).max(500, { message: "Review cannot exceed 500 characters" }),
    rating: z.number().min(1, { message: "Please select a rating" }).max(5, { message: "Rating must be between 1 and 5" })
});

export const Review = ({ 
    isReviewDialogOpen, 
    setIsReviewDialogOpen, 
    
    order,
    userReview
}: { 
    isReviewDialogOpen: boolean, 
    setIsReviewDialogOpen: (value: boolean) => void, 
    order: any,
    userReview: any
}) => {
    const { postReview, loading, error } = usePostReview();
    const [selectedRating, setSelectedRating] = useState<number | null>(null);

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            review: "",
            rating: undefined,
        },
    });

    const onSubmit = async (data: z.infer<typeof reviewSchema>) => {
        try {
            // Ensure rating is selected
            if (!selectedRating) {
                toast.error("Please select a rating");
                return;
            }

          
            const reviewData = {
                ...data,
                rating: selectedRating,
                project_id: order?.property?.id
            };
            console.log(reviewData);

            // Post review
            const response = await postReview(reviewData);

                    if (response) {
                        toast.success("Your review has been submitted");
                        setIsReviewDialogOpen(false);
                    }
        } catch (err) {
            toast.error("Failed to submit review. Please try again.");
        }
    };

    // Handle star rating selection
    const handleStarClick = (rating: number) => {
        setSelectedRating(rating);
        form.setValue('rating', rating);
    };

    // Star rating data with hover effects and colors
    const starRatings = [
        { src: "/1star.svg", hoverBg: "hover:bg-[#FF8888]", selectedBg: "bg-[#FF8888]", rating: 1 , text: "Terrible" },
        { src: "/2.svg", hoverBg: "hover:bg-[#FFAEAE]", selectedBg: "bg-[#FFAEAE]", rating: 2 , text: "Bad" },
        { src: "/3star.svg", hoverBg: "hover:bg-[#FFF7B7]", selectedBg: "bg-[#FFF7B7]", rating: 3 , text: "Average" },
        { src: "/4.svg", hoverBg: "hover:bg-[#BDFFB7]", selectedBg: "bg-[#BDFFB7]", rating: 4 , text: "Good" },
        { src: "/5.svg", hoverBg: "hover:bg-[#8CFF82]", selectedBg: "bg-[#8CFF82]", rating: 5 , text: "Excellent" }
    ];

    return (
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogContent className="w-[350px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#464646] flex items-center justify-center rounded-full">
                                <MessageSquareTextIcon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-base text-[#464646] font-semibold">
                                Review
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center gap-2">
                    <h1 className="text-lg font-medium text-[#464646]">How is your experience with us?</h1>
                    <p className="text-sm text-[#464646]">Your Input is valuable to us</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex items-center h-24 justify-center w-full space-x-4">
                            {starRatings.map((star) => (
                                <div 
                                    key={star.rating}
                                    onClick={() => handleStarClick(star.rating)}
                                    className="flex flex-col items-center group cursor-pointer gap-2 relative"
                                >
                                    <div 
                                        className={cn(
                                            "p-2 rounded-full",
                                            "transition-all duration-300 ease-in-out",
                                            "hover:shadow-lg",
                                            selectedRating === star.rating 
                                                ? `${star.selectedBg} scale-125 shadow-md` 
                                                : `hover:${star.selectedBg} group-hover:scale-100`,
                                            "flex items-center justify-center"
                                        )}
                                    >
                                        <Image 
                                            src={star.src}
                                            alt={`${star.rating} star rating`}
                                            width={100}
                                            height={100}
                                            className={cn(
                                                "transition-all duration-300",
                                                selectedRating === star.rating 
                                                    ? "scale-110" 
                                                    : "group-hover:scale-125"
                                            )}
                                            priority
                                        />
                                    </div>
                                    <span 
                                        className={cn(
                                            "absolute -bottom-6",
                                            "text-sm font-medium",
                                            "opacity-0 group-hover:opacity-100",
                                            "transition-all duration-300",
                                            selectedRating === star.rating
                                                ? "text-primary font-semibold opacity-100"
                                                : "text-gray-600"
                                        )}
                                    >
                                        {star.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {form.formState.errors.rating && (
                            <p className="text-destructive text-sm">
                                {form.formState.errors.rating.message}
                            </p>
                        )}

                        <FormField
                            control={form.control}
                            name="review"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add Review" 
                                            className="w-full min-h-[100px] border border-gray-300 rounded-lg "
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsReviewDialogOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/80 text-white"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default Review;
