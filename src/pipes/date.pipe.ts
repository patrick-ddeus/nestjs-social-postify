import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ParseBoolPipeOptions,
  NotAcceptableException,
} from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  private options: ParseBoolPipeOptions;

  constructor(options?: ParseBoolPipeOptions) {
    this.options = options;
  }

  transform(value: string, metadata: ArgumentMetadata): Date {
    if (this.options.optional && !value) {
      return null;
    }

    const incomingDate = new Date(value);

    if (!incomingDate.getDate()) {
      throw new NotAcceptableException();
    }

    return incomingDate;
  }
}
