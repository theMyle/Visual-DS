
// takes in:

import ProgressDots from "./ProgressDots";

// question
// optional visualization
// 4 choices
// 2 Hyper correction feedback explanation (correct or wrong)

// callback function for answer

interface AssessmentProps {
    question: string;

}


export default function Assessment() {
    return (
        <>
            <ProgressDots current={6} total={10} answered={[true, true, true, true, true]} correct={[false, false, true, true]}></ProgressDots>
        </>
    )
}