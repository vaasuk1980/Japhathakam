import TextInput from "../TextInput";
import TextArea from "../TextArea";
import NumberInput from "../NumberInput";
import DateInput from "../DateInput";
import TimeInput from "../TimeInput";
import Select from "../Select";
import PlaceAutocomplete from "../PlaceAutocomplete/PlaceAutocomplete";

const controlRegistry = {
    text: TextInput,
    textarea: TextArea,
    number: NumberInput,
    date: DateInput,
    time: TimeInput,
    select: Select,
    place: PlaceAutocomplete,
};

export default controlRegistry;