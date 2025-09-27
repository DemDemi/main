import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Validation_Exception } from "./validation.exceprion";

@Injectable()
export class Validation_Pipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {

        if (metadata.type !== 'body') {
            return value;
        }
        // multipart/form-data Here I Cant Do more 
        if (
            typeof value === 'object' &&
            value instanceof Object &&
            value.constructor === Object &&
            !Object.keys(value).length
        ) {
            return value;
        }
        if (!metadata.metatype) return value;

        if (!value || Object.keys(value).length === 0) {
            throw new Validation_Exception([{ field: 'body', message: 'Empty Validation Fail' }]);
        }
        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);
        if (errors.length) {
            const messages = errors.map(err => ({
                field: err.property,
                message: err.constraints ? Object.values(err.constraints).join(', ') : '',
            }));
            throw new Validation_Exception(messages);
        }

        return obj;
    }

}
