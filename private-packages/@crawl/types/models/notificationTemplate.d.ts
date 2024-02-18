import { SchemaId } from '../common/id';
import { TemplateProviderType, TemplateTitleType, TemplateType } from '../enums';

interface BasicTemplate {
    title: TemplateTitleType;
    article: string;
}

interface INotificationTemplate {
    _id: SchemaId.Id;
    id: string;
    type: TemplateType;
    provider: TemplateProviderType;
    template: BasicTemplate;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

export type { INotificationTemplate };
