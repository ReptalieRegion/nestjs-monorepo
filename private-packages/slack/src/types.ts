import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';

interface SlackApiOptions {
    type: 'api';
    token: string;
    defaultChannel?: string;
}

type SlackConfig = SlackApiOptions;

type SlackSyncConfig = SlackConfig & {
    isGlobal?: boolean;
};

interface SlackAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
    useClass?: Type<SlackConfigFactory>;
    useFactory?: (...args: unknown[]) => Promise<SlackConfig> | SlackConfig;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<SlackConfigFactory>;
    isGlobal?: boolean;
}

interface SlackConfigFactory {
    slackConfigModuleOptions(): Promise<SlackConfig> | SlackConfig;
}

export type { SlackApiOptions, SlackConfig, SlackSyncConfig, SlackConfigFactory, SlackAsyncConfig };
