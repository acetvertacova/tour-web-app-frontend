import * as yup from "yup";

const tourSchema = yup.object().shape({
    imagesUrl: yup
        .array()
        .of(yup.string()
            .required("The image is required")
            .trim()
            .url("Must be an URL")),
    name: yup
        .string()
        .required("Name is required!")
        .trim(),
    country: yup
        .string()
        .required("Country is required!")
        .trim(),
    city: yup
        .string()
        .required("City is required!")
        .trim(),
    hotel: yup
        .string()
        .required("Hotel is required!")
        .trim(),
    description: yup
        .string()
        .required("Description is required!")
        .min(10, "The description should consist of at least 10 symbols")
        .max(1000, "The description should consist maximum of 1000 symbols")
        .trim(),
    price: yup
        .number()
        .required("Price is required!")
        .min(0, "Price must be a positive number!")
        .typeError("Price must be a number!"),
    maxCapacity: yup
        .number()
        .required("Max capacity is required!")
        .min(0, "Max capacity must be a positive number!")
        .typeError("Max capacity must be a number!"),
    availableSpots: yup
        .number()
        .required("Available spots are required!")
        .min(0, "Available spots must be a positive number!")
        .typeError("Available spots must be a number!"),
    rating: yup
        .number()
        .required("Rating are required!")
        .min(1, "Minimum 1 star")
        .max(5, "Maximum 5 stars")
        .integer("Rating must be an integer!")
        .typeError("Rating must be a number!"),
    checkInDate: yup
        .date()
        .required("Check-in date is required!")
        .typeError("Check-in date is invalid!"),
    checkOutDate: yup
        .date()
        .required("Check-out date is required!")
        .typeError("Check-out date is invalid!")
        .min(
            yup.ref("checkInDate"),
            "Check-out date must be after check-in date!"
        ),
    activities: yup
        .array()
        .of(yup.string()
            .required("Activites are required")
            .min(1, "At least one activity is required")),
}).required();

export default tourSchema;
