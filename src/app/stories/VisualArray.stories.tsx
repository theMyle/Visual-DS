
import "../globals.css"
import VisualArray from "@/app/components/visual-array/VisualArray";
import {createArrayElements} from "@/app/components/visual-array/utils";

export default {
    title: "Components/visual-array",
    component: VisualArray,
};

const values = createArrayElements(1,2,3,4,5,6,7,8,9,10)

export const Default = {
    args:{
        array: values,
    },
};
