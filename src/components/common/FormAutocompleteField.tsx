import { Controller } from "react-hook-form";
import {
    Autocomplete,
    CircularProgress,
    FormControl,
    FormLabel,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useState } from "react";

type OptionType = {
    label: string;
    value: string | number;
};

type Props = {
    name: string;
    control: any;
    defaultValue: any;
    rules?: any;
    field: any;
    errors: any;
    options: OptionType[];
    isMultiple?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    placeholder?: string;
    refresh?: () => void
};

export const FormAutocompleteField = ({
    name,
    control,
    defaultValue,
    rules,
    field,
    errors,
    options,
    isMultiple = false,
    isDisabled = false,
    isLoading = false,
    placeholder,
    refresh = undefined
}: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field: formField }) => {
                const selectedValue = isMultiple
                    ? options.filter((opt) =>
                        formField.value?.includes(opt.value)
                    )
                    : options.find(
                        (opt) => opt.value === formField.value
                    ) || null;

                return (
                    <FormControl
                        fullWidth
                        required={field?.required}
                        error={!!errors[name]}
                        disabled={isDisabled || isLoading}
                    >
                        <FormLabel>{field?.label}</FormLabel>

                        <Autocomplete
                            multiple={isMultiple}
                            disableCloseOnSelect={isMultiple}
                            size="small"
                            options={options}
                            loading={isLoading}
                            disabled={isLoading}
                            value={selectedValue}
                            getOptionLabel={(option) => option?.label || ""}
                            isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                            }
                            onChange={(_, value: any) => {
                                if (isMultiple) {
                                    formField.onChange(
                                        value?.map((v: any) => v?.value)
                                    );
                                } else {
                                    formField.onChange(value?.value ?? null);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder={
                                        placeholder ||
                                        field?.placeholder ||
                                        "Select..."
                                    }
                                    error={!!errors[name]}
                                    helperText={errors[name]?.message as string}
                                    size="small"
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoading && (
                                                    <CircularProgress color="inherit" size={18} />
                                                )}

                                                {refresh && !isLoading && isFocused && (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            size="small"
                                                            onMouseDown={(e) => e.preventDefault()}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // prevent dropdown toggle
                                                                refresh();
                                                            }}
                                                        >
                                                            <Refresh fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )}

                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </FormControl>
                );
            }}
        />
    );
};