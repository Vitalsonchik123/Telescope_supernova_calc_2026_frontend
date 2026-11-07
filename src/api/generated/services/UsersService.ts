/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { models_LoginRequest } from '../models/models_LoginRequest';
import type { models_RegisterRequest } from '../models/models_RegisterRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Аутентификация
     * Возвращает JWT-токен при успешном входе
     * @param body Данные для входа
     * @returns any OK
     * @throws ApiError
     */
    public static postUsersLogin(
        body: models_LoginRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/login',
            body: body,
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Деавторизация
     * Добавляет JWT в blacklist Redis. Токен больше не действителен.
     * @returns any OK
     * @throws ApiError
     */
    public static postUsersLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/logout',
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Регистрация пользователя
     * Создаёт нового пользователя с хешированным паролем
     * @param body Данные регистрации
     * @returns any Created
     * @throws ApiError
     */
    public static postUsersRegister(
        body: models_RegisterRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/register',
            body: body,
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
}
