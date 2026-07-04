import TextInput from "../TextInput";
import TextArea from "../TextArea";
import NumberInput from "../NumberInput";
import DateInput from "../DateInput";
import TimeInput from "../TimeInput";
import Select from "../Select";

const controlRegistry = {
    text: TextInput,
    textarea: TextArea,
    number: NumberInput,
    date: DateInput,
    time: TimeInput,
    select: Select,
};

export default controlRegistry;