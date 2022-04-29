import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CssFlexLayoutModule } from 'angular-css-flex-layout';
// tslint:disable-next-line: max-line-length
import { MatRadioModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatProgressSpinnerModule, MatTableModule, MatButtonToggleModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
    imports: [],
    exports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        CssFlexLayoutModule,
        MatRadioModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatTableModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatTooltipModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatProgressSpinnerModule
    ],
    declarations: [],
    providers: [],
})
export class SharedImportsModule { }
