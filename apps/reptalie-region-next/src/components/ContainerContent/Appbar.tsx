export interface IAppbar {
    title?: string;
}

const Appbar = ({ title }: IAppbar) => {
    return (
        <div className="flex flex-row justify-between border-b p-15pxr">
            <div>{'<'}</div>
            <div>{title}</div>
            <div></div>
        </div>
    );
};

export default Appbar;
