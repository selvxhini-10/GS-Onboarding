from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from backend.api.models.request_model import CommandRequest
from backend.api.models.response_model import CommandListResponse, CommandSingleResponse
from backend.data.data_models import Command
from backend.data.engine import get_db

# Prefix: "/commands"
command_router = APIRouter(tags=["Commands"])


@command_router.get("/", response_model=CommandListResponse)
def get_commands(db: Session = Depends(get_db)):
    """
    Gets all the items

    :return: Returns a list of commands
    """

    items = db.exec(select(Command)).all()
    return {"data": items}


@command_router.post("/", response_model=CommandSingleResponse)
def create_command(payload: CommandRequest, db: Session = Depends(get_db)):

    """
    Creates an item with the given payload in the database and returns this payload after pulling it from the database 

    :param payload: The data used to create an item
    :return: returns a json object with field of "data" under which there is the payload now pulled from the database 
    """
    # COMPLETED:(Member) Implement this endpoint
    payload = Command.model_validate(payload.model_dump())
    db.add(payload)
    db.commit()
    db.refresh(payload)
    return {"data": payload}


@command_router.delete("/{id}", response_model=CommandListResponse)
def delete_command(id: int, db: Session = Depends(get_db)):
    """
    Deletes the item with the given id if it exists. Otherwise raises a 404 error.

    :param id: The id of the item to delete
    :return: returns the list of commands after deleting the item
    """
    # COMPLETED:(Member) Implement this endpoint

    command = db.get(Command, id)
    if not command: # raise 404 if command does not exist  
        raise HTTPException(status_code=404, detail="Command not found")

    db.delete(command)
    db.commit()
    remaining_commands = get_commands(db)

    return {"data": remaining_commands}