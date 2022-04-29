// tslint:disable-next-line: no-empty-interface
export interface StoreSettings {
    id: number;
    name: string;
    url: string;
    ssl_enabled: boolean;
    secure_url: string;
    default_language_id: any;
    language_ids: any;
    display_order: any;
    company_name: string;
    company_address: string;
    company_vat: string;
    company_phone_number: string;
    hosts: string;
    primary_currency_display_locale: any;
    isContactUsFormEnabled: boolean;
    email: string;
}

// tslint:disable-next-line: max-line-length
// {"stores":[{"id":"1","name":"Y Jewelry","url":"https://y.jewelry/","ssl_enabled":true,"secure_url":null,"hosts":"y.jewelry,www.y.jewelry","default_language_id":1,"language_ids":[1],"display_order":1,"company_name":"RIPOPS INDIA JEWELERY PVT LTD <br>","company_address":"NO 217, LOWER GROUND FLOOR SECTOR 30 GURUGRAM - 122 001","company_phone_number":"0124-494 5158,98102 30784","company_vat":null,"primary_currency_display_locale":"en-IN"}]}
export interface StoreSettingsResponse {
    stores: StoreSettings[];
}
