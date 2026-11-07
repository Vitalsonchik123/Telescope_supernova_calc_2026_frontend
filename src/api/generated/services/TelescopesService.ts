/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { models_LikeRequest } from '../models/models_LikeRequest';
import type { models_PublishTelescopeRequest } from '../models/models_PublishTelescopeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TelescopesService {
    /**
     * Получить черновик текущего пользователя
     * Возвращает единственный черновик пользователя (не более 1)
     * @returns any OK
     * @throws ApiError
     */
    public static getDraft(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/draft',
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Лента опубликованных услуг
     * Возвращает первый опубликованный телескоп или следующий по ID
     * @param id ID текущего телескопа
     * @param next Перейти к следующему
     * @returns any OK
     * @throws ApiError
     */
    public static getFeed(
        id?: number,
        next?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feed',
            query: {
                'id': id,
                'next': next,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Список опубликованных телескопов
     * Возвращает список опубликованных услуг с фильтром по диаметру и автору
     * @param minAperture Минимальный диаметр (см)
     * @param isMine Только мои услуги
     * @returns any OK
     * @throws ApiError
     */
    public static getTelescopes(
        minAperture?: number,
        isMine?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/telescopes',
            query: {
                'min_aperture': minAperture,
                'is_mine': isMine,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Создать черновик услуги
     * Создаёт черновик и загружает картинку + видео в MinIO
     * @param name Название услуги
     * @param image Изображение
     * @param video Короткое видео
     * @returns any Created
     * @throws ApiError
     */
    public static postTelescopes(
        name: string,
        image?: Blob,
        video?: Blob,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/telescopes',
            formData: {
                'name': name,
                'image': image,
                'video': video,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Логическое удаление услуги
     * Меняет статус на deleted. Только для автора.
     * @param id ID услуги
     * @returns any OK
     * @throws ApiError
     */
    public static deleteTelescopes(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/telescopes/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Поставить или снять лайк
     * Принимает like=1 (поставить) или like=0 (снять)
     * @param id ID услуги
     * @param body Данные лайка
     * @returns any OK
     * @throws ApiError
     */
    public static postTelescopesLike(
        id: number,
        body: models_LikeRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/telescopes/{id}/like',
            path: {
                'id': id,
            },
            body: body,
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Опубликовать услугу
     * Меняет статус черновика на published. Только для автора.
     * @param id ID услуги
     * @param body Данные для публикации
     * @returns any OK
     * @throws ApiError
     */
    public static putTelescopesPublish(
        id: number,
        body: models_PublishTelescopeRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/telescopes/{id}/publish',
            path: {
                'id': id,
            },
            body: body,
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
