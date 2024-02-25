import { DynamicModule, Module } from '@nestjs/common';
import { SLACK_MODULE_USER_OPTIONS } from './constants';
import { SlackService } from './slack.service';
import { SlackSyncConfig } from './types';

@Module({
    providers: [SlackService],
    exports: [SlackService],
})
export class SlackModule {
    static forRoot(options: SlackSyncConfig): DynamicModule {
        const providers = [
            {
                provide: SLACK_MODULE_USER_OPTIONS,
                useValue: options,
            },
        ];

        return {
            global: options.isGlobal,
            module: SlackModule,
            providers,
            exports: providers,
        };
    }
}
