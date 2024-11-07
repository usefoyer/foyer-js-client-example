/**
 * Helper class to lazily evaluate and cache some value.
 */
export class LazyValue<T> {
    hasValue: boolean;
    value: T;
    getter: Function;

    constructor(getter: Function) {
        this.getter = getter;
    }

    async get(): Promise<T> {
        if (!this.hasValue) {
            this.value = await this.getter();
            this.hasValue = true;
        }
        return this.value;
    }
}