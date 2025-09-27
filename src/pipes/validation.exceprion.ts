import { HttpException, HttpStatus } from "@nestjs/common";

export class Validation_Exception extends HttpException {
    messages;

    constructor(response) {
        super(response, HttpStatus.BAD_REQUEST);
        this.message = response
    }
}