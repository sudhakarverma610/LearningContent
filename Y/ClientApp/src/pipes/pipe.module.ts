import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlToPlaintextPipe } from './htmltoplaintext.pipe';
import { AllWordsExceptFirst } from './allWordsExceptFirst.pipe';
import { FirstWordOnly } from './firstWordOnly.pipe';
import { ChangeSrcExtension } from './changeSrcExtension.pipe';
import { PriceRangeExtension } from './priceRange.pipe';
import { SplitArrayOneToMany } from './splitArrayOneToMany.pipe';
import { ToFixedPipe } from './ToFixed.pipe';
import { RatingMappingPipe } from './ratingMapping.pipe';
import { UploadTextLimitPipe } from './uploadTextLimit.pipe';
import { IsShowLeftRightScrollPipeIcon} from './isShowLeftScrollIcon.pipe';
import { SpiltProductsPipe } from './SpiltProducts.pipe';
import { NumberToArrayPipe } from './numberToArray.pipe';
import { ChangeSrcExtensionToNavPipe } from './changeSrcExtensionToNav.pipe';
import { ConfiguratorImagePipe } from './ConfiguratorImage.pipe';
import { SanitizehtmlPipe } from './sanitizehtml.pipe';

@NgModule({
  declarations: [									
    HtmlToPlaintextPipe,
    AllWordsExceptFirst,
    FirstWordOnly,
    ChangeSrcExtension,
    PriceRangeExtension,
    SplitArrayOneToMany,
    ToFixedPipe,
    RatingMappingPipe,
    UploadTextLimitPipe,
    IsShowLeftRightScrollPipeIcon,
    SpiltProductsPipe,
      NumberToArrayPipe,
      ChangeSrcExtensionToNavPipe,
      ConfiguratorImagePipe,
      SanitizehtmlPipe
   ],
  imports: [CommonModule],
  exports: [
    HtmlToPlaintextPipe,
    AllWordsExceptFirst,
    FirstWordOnly,
    ChangeSrcExtension,
    PriceRangeExtension,
    SplitArrayOneToMany,
    ToFixedPipe,
    RatingMappingPipe,
    UploadTextLimitPipe,
    IsShowLeftRightScrollPipeIcon,
    SpiltProductsPipe,
    NumberToArrayPipe,
    ChangeSrcExtensionToNavPipe,
    ConfiguratorImagePipe,
    SanitizehtmlPipe
  ]
})
export class PipeModule {}
