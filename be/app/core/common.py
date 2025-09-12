# common function
from sqlalchemy.orm import Session

def Generate_code(name: str, db: Session, model:any) -> str:
    """
    Generate code from name and last number from db
    """
    name = ''.join([x[0] for x in name.split()])
    last_data = db.query(model).filter(model.code.like(f"{name}%")).order_by(model.id.desc()).first()
    if last_data:
        last_number = int(last_data.code.split(name)[-1])
        new_code = f"{name}{last_number + 1:03}"
    else:
        new_code = f"{name}001"
    if db.query(model).filter_by(code=new_code).first():
        raise ValueError(f"Code {new_code} already exist")
    return new_code
