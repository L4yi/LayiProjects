
export default function InputField({ ...props }) {
    return (
        <>
            <div className="input-wrapper">
                <label>{props.title};</label>
                <input
                    type={props.inputType}
                    placeholder={props.placeHolder}
                    className="text-field"
                />
            </div>
        </>
    )
}