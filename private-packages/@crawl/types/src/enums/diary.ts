enum DiaryCalendarMarkType {
    Meal = '먹이급여',
    Cleaning = '청소',
    Molting = '탈피',
    Mating = '메이팅',
    LayingEggs = '산란',
    WarmBath = '온욕',
    Elimination = '배변',
}

enum DiaryEntityGenderType {
    Male = 'Male',
    Female = 'Female',
    Uncategorized = 'Uncategorized',
}

enum DiaryEntityWeightType {
    g = 'g',
    kg = 'kg',
}

export { DiaryCalendarMarkType, DiaryEntityGenderType, DiaryEntityWeightType };
