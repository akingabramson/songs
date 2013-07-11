class GuessesController < ApplicationController
  # before_filter :require_json_login

  def create
    @guess = current_user.guesses.build(params[:guess])
    if @guess.save
      render json: @guess.to_json(include: {:user => {only: [:name]}})
    else
      render json: @guess.errors, status: 422
    end
  end

  def update
    @guess = Guess.find(params[:id])
    if !@guess
      render json: {}, status: 404
    else
      if @guess.update_attributes(params[:guess])
        render json: @guess
      else
        render json: @guess.errors, status: 422
      end
    end
  end

  def destroy
    @guess = Guess.find(params[:id])
    if !@guess
      render json: {}, status: 404
    else
      if @guess.destroy
        render json: {message: "Destroyed!"}
      else
        render json: @guess.errors, status: 422
      end
    end
  end

end
