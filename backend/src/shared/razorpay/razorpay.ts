import Razorpay from "razorpay";
import { ENV } from "../env/ENV";

export const razorpay = new Razorpay({
    key_id: ENV.RAZORPAY_KEY_ID,
    key_secret: ENV.RAZORPAY_KEY_SECRET,
});

