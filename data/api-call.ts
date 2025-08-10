'use client'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RequestOptions {
    headers?: Record<string, string>;
    body?: any;
    params?: Record<string, string | number>;
}

export class ApiCall {
    private route: string;
    private callType: HttpMethod = 'get';
    private baseRoute: string;

    constructor() {
        this.baseRoute = process.env.NEXT_PUBLIC_API_ROUTE ?? '';
        this.route = this.baseRoute;
    }

    private appendRoute(route: string) {
        this.route = this.baseRoute + route;
    }

    get(route: string) {
        this.callType = 'get';
        this.appendRoute(route);
        return this;
    }

    post(route: string) {
        this.callType = 'post';
        this.appendRoute(route);
        return this;
    }

    patch(route: string) {
        this.callType = 'patch';
        this.appendRoute(route);
        return this;
    }

    put(route: string) {
        this.callType = 'put';
        this.appendRoute(route);
        return this;
    }

    delete(route: string) {
        this.callType = 'delete';
        this.appendRoute(route);
        return this;
    }

    async send(data?: any, options?: RequestOptions): Promise<any> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
        };

        let url = this.route;

        // If there are query parameters
        if (options?.params) {
            const query = new URLSearchParams();
            for (const [key, value] of Object.entries(options.params)) {
                query.append(key, String(value));
            }
            url += `?${query.toString()}`;
        }

        const fetchOptions: RequestInit = {
            method: this.callType.toUpperCase(),
            headers,
        };

        if (data && ['post', 'put', 'patch'].includes(this.callType)) {
            fetchOptions.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, fetchOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error during ${this.callType.toUpperCase()} request to ${url}:`, error);
            throw error;
        } finally {
            // Reset to base route for next use
            this.route = this.baseRoute;
            this.callType = 'get';
        }
    }
}