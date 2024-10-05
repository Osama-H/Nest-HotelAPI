import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';

export const imageFileValidation = new ParseFilePipe({
  validators: [
    new FileTypeValidator({
      fileType: /(image\/jpeg|image\/jpg|image\/png)$/i,
    }),
  ],
});
