enum UserActivityType {
    ACCESS = 'ACCESS', // 접속
    LOGIN = 'LOGIN', // 로그인
    LOGOUT = 'LOGOUT', // 로그아웃
    POST_CREATED = 'POST_CREATED', // 게시글 생성
    POST_UPDATED = 'POST_UPDATED', // 게시글 수정
    COMMENT_CREATED = 'COMMENT_CREATED', // 댓글 생성
    COMMENT_UPDATED = 'COMMENT_UPDATED', // 댓글 수정
    ENTITY_CREATED = 'ENTITY_CREATED', // 개체 생성
    ENTITY_UPDATED = 'ENTITY_UPDATED', // 개체 수정
    ENTITY_WEIGHT_CREATED = 'ENTITY_WEIGHT_CREATED', // 개체 몸무게 생성
    ENTITY_WEIGHT_UPDATED = 'ENTITY_WEIGHT_UPDATED', // 개체 몸무게 수정
    CALENDAR_CREATED = 'CALENDAR_CREATED', // 캘린더 생성
    CALENDAR_UPDATED = 'CALENDAR_UPDATED', // 캘린더 수정
    PROFILE_UPDATED = 'PROFILE_UPDATED', // 프로필 수정
}

export { UserActivityType };
