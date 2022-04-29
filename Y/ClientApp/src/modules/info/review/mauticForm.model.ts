
export interface FormObject {
    form: Form;
}

export interface Form {
    isPublished:    boolean;
    dateAdded:      Date;
    dateModified:   Date;
    createdBy:      number;
    createdByUser:  string;
    modifiedBy:     number;
    modifiedByUser: string;
    id:             number;
    name:           string;
    alias:          string;
    category:       null;
    description:    null;
    cachedHtml:     string;
    publishUp:      null;
    publishDown:    null;
    fields:         Field[];
}

export interface Field {
    id:                  number;
    label:               string;
    showLabel:           boolean;
    alias:               string;
    type:                string;
    defaultValue:        null;
    isRequired:          boolean;
    validationMessage:   null;
    helpMessage:         null;
    order:               number;
    properties:          any[] | PropertiesClass;
    labelAttributes:     null | string;
    inputAttributes:     null | string;
    containerAttributes: null | string;
    leadField:           null | string;
    saveResult:          boolean;
    isAutoFill:          boolean;
}

export interface PropertiesClass {
    placeholder?:     null;
    syncList?:        number;
    optionlist?:      OptionlistClass;
    labelAttributes?: null;
    list?:            OptionlistClass;
    empty_value?:     string;
    multiple?:        number;
}

export interface OptionlistClass {
    list: ListElement[];
}

export interface ListElement {
    label: string;
    value: string;
}