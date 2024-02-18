enum TemplateTitleType {
    Share = '일상공유',
    User = '회원',
    Service = '서비스',
    Default = '크롤',
}

enum ContentType {
    Profile = '프로필이미지',
    SharePost = '일상공유이미지',
    Notice = '공지사항',
}

enum TemplateType {
    Notice = '공지사항',
    Comment = '댓글',
    Like = '좋아요',
    Follow = '팔로우',
    Tag = '태그',
}

enum TemplateProviderType {
    PUSH = 'PUSH',
    LMS = 'LMS',
    SMS = 'SMS',
}

export { ContentType, TemplateTitleType, TemplateProviderType, TemplateType };
