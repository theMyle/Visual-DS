
import "../globals.css"
import VisualArrayBox from "@/app/components/visual-array/VisualArrayBox";
import {ArrayElementAnimationState} from "@/app/components/visual-array/types";

export default {
    title: "Components/VisualArrayBox",
    component: VisualArrayBox,
};

export const Default = {
    args: {
        value: 4,
        animationState: ArrayElementAnimationState.Default,
    }
};
